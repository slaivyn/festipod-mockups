import React from 'react';
import { Button, Title, Text } from '../components/sketchy';
import type { ScreenProps } from './index';

export function WelcomeScreen({ navigate }: ScreenProps) {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Title style={{ textAlign: 'center', fontSize: 32, marginBottom: 24 }}>Festipod</Title>

        <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 32, lineHeight: 1.5 }}>
          Découvrez des événements près de chez vous, relayés par des gens de confiance.
        </Text>

        <div style={{
          background: 'var(--sketch-light-gray)',
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
        }}>
          <Text style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--sketch-gray)' }}>
            Festipod est un projet collaboratif en construction. Nous croyons qu'on découvre
            les meilleurs événements grâce au bouche-à-oreille, pas via des algorithmes.
            Rejoignez les premiers utilisateurs et aidez-nous à créer une alternative
            humaine aux réseaux sociaux traditionnels.
          </Text>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>🎪</span>
            <Text style={{ margin: 0, fontSize: 14 }}>Relayez des événements à votre réseau</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>🤝</span>
            <Text style={{ margin: 0, fontSize: 14 }}>Rencontrez des personnes partageant vos centres d'intérêt</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>🔒</span>
            <Text style={{ margin: 0, fontSize: 14 }}>Vos données restent les vôtres</Text>
          </div>
        </div>

        <Button variant="primary" onClick={() => navigate('login')} style={{ marginBottom: 12 }}>
          Rejoindre la communauté
        </Button>

        <Text style={{ textAlign: 'center', fontSize: 13, color: 'var(--sketch-gray)' }}>
          Déjà membre ? Se connecter
        </Text>
      </div>

      <Text style={{ textAlign: 'center', fontSize: 12, color: 'var(--sketch-gray)' }}>
        Version beta - 127 membres actifs
      </Text>
    </div>
  );
}
