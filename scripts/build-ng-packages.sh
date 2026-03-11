#!/bin/bash
#
# Build and install @ng-org packages from local nextgraph-rs repo.
#
# This script:
#   1. git pull on nextgraph-rs
#   2. Installs monorepo deps (pnpm install)
#   3. Builds the 4 packages we need (tsc / vite)
#   4. Packs them into tarballs (applies publishConfig -> dist/)
#   5. Installs the tarballs in festipod and updates package.json versions
#
# Usage:
#   bash scripts/build-ng-packages.sh
#
# Run this after any nextgraph-rs update, or as needed.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FESTIPOD_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
NEXTGRAPH_RS="${NEXTGRAPH_RS:-$(cd "$FESTIPOD_DIR/../../nextgraph/nextgraph-rs" && pwd)}"
SDK_JS="$NEXTGRAPH_RS/sdk/js"
TARBALLS_DIR="$FESTIPOD_DIR/.ng-tarballs"

# Packages to build (in dependency order)
PACKAGES=(alien-deepsignals shex-orm web orm)

echo "=== @ng-org local build ==="
echo "  nextgraph-rs: $NEXTGRAPH_RS"
echo "  festipod:     $FESTIPOD_DIR"
echo ""

# --- Step 0: git pull ---
echo "[0/5] Pulling latest nextgraph-rs..."
cd "$NEXTGRAPH_RS"
git pull --ff-only || echo "  WARN: git pull failed (maybe uncommitted changes?) — continuing with current state"
echo ""

# --- Step 1: Ensure lib-wasm/pkg stub exists ---
LIB_WASM_PKG="$SDK_JS/lib-wasm/pkg"
if [ ! -f "$LIB_WASM_PKG/package.json" ]; then
  echo "[1/5] Creating lib-wasm/pkg stub (type-only dependency)..."
  mkdir -p "$LIB_WASM_PKG"
  cat > "$LIB_WASM_PKG/package.json" << 'STUBEOF'
{
  "name": "@ng-org/lib-wasm",
  "version": "0.0.0-stub",
  "type": "module",
  "main": "./index.js",
  "types": "./index.d.ts"
}
STUBEOF
  echo "export {};" > "$LIB_WASM_PKG/index.js"
  # Wildcard type stub: all methods are accepted via index signature
  cat > "$LIB_WASM_PKG/index.d.ts" << 'DTSEOF'
// Stub types for @ng-org/lib-wasm (real build requires Rust/WASM)
export declare function orm_start_graph(...args: any[]): any;
export declare function orm_start_discrete(...args: any[]): any;
export declare function graph_orm_update(...args: any[]): any;
export declare function discrete_orm_update(...args: any[]): any;
export declare function doc_create(...args: any[]): any;
export declare function doc_subscribe(...args: any[]): any;
export declare function file_get(...args: any[]): any;
export declare function app_request_stream(...args: any[]): any;
// Catch-all for any other methods
declare const _extra: { [key: string]: (...args: any[]) => any };
export default _extra;
DTSEOF
else
  echo "[1/5] lib-wasm/pkg stub already exists"
fi
echo ""

# --- Step 2: Install monorepo deps ---
echo "[2/5] Installing monorepo dependencies..."
cd "$NEXTGRAPH_RS"
pnpm install --frozen-lockfile 2>/dev/null || pnpm install
echo ""

# --- Step 3: Build each package ---
echo "[3/5] Building packages..."
for pkg in "${PACKAGES[@]}"; do
  PKG_DIR="$SDK_JS/$pkg"
  if [ ! -d "$PKG_DIR" ]; then
    echo "  SKIP $pkg (directory not found)"
    continue
  fi

  # Check if there's a build script
  HAS_BUILD=$(node -e "const p=require('$PKG_DIR/package.json'); process.stdout.write(p.scripts?.build ? '1' : '0')")
  if [ "$HAS_BUILD" = "0" ]; then
    # Try build:ts (orm, alien-deepsignals)
    HAS_BUILD_TS=$(node -e "const p=require('$PKG_DIR/package.json'); process.stdout.write(p.scripts?.['build:ts'] ? '1' : '0')")
    if [ "$HAS_BUILD_TS" = "1" ]; then
      echo "  Building $pkg (build:ts)..."
      cd "$PKG_DIR"
      pnpm run build:ts
    else
      echo "  SKIP $pkg (no build script)"
    fi
  else
    echo "  Building $pkg (build)..."
    cd "$PKG_DIR"
    pnpm run build
  fi
done
echo ""

# --- Step 4: Pack each package ---
echo "[4/5] Packing tarballs..."
rm -rf "$TARBALLS_DIR"
mkdir -p "$TARBALLS_DIR"

for pkg in "${PACKAGES[@]}"; do
  PKG_DIR="$SDK_JS/$pkg"
  if [ ! -d "$PKG_DIR/dist" ]; then
    echo "  WARN: $pkg has no dist/ — skipping pack"
    continue
  fi
  cd "$PKG_DIR"
  TARBALL=$(pnpm pack --pack-destination "$TARBALLS_DIR" 2>/dev/null | tail -1)
  echo "  Packed $pkg → $(basename "$TARBALL")"
done
echo ""

# --- Step 5: Install tarballs in festipod (one by one, in dependency order) ---
echo "[5/5] Installing in festipod..."
cd "$FESTIPOD_DIR"

# Install one by one to avoid Bun's dependency loop detection issue
for pkg in "${PACKAGES[@]}"; do
  TGZ=$(ls "$TARBALLS_DIR"/ng-org-${pkg}-*.tgz 2>/dev/null | head -1)
  if [ -z "$TGZ" ]; then
    echo "  WARN: no tarball for $pkg"
    continue
  fi
  echo "  Installing @ng-org/$pkg..."
  bun add "$TGZ"
done

echo ""
echo "=== Done! All @ng-org packages installed from local build ==="
echo ""
echo "Installed versions:"
for pkg in "${PACKAGES[@]}"; do
  VERSION=$(node -e "try{const p=require('$FESTIPOD_DIR/node_modules/@ng-org/$pkg/package.json');console.log(p.version)}catch{console.log('not found')}")
  echo "  @ng-org/$pkg: $VERSION"
done
