import React from 'react';
import { Button, Input, Title, Text, Divider } from '../../../shared/components/sketchy';
import { useNextGraph } from '../../../shared/context/NextGraphContext';
import type { ScreenProps } from '../../../screens';

export function LoginScreen({ navigate }: ScreenProps) {
  const { status, connect } = useNextGraph();

  const handleNgLogin = () => {
    if (status === 'connected') {
      navigate('home');
    } else {
      connect();
    }
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Title style={{ textAlign: 'center', fontSize: 32, marginBottom: 8 }}>Festipod</Title>
        <Text style={{ textAlign: 'center', marginBottom: 32 }}>Créez et rejoignez des événements entre amis</Text>

        {/* NextGraph login */}
        <div style={{ marginBottom: 24 }}>
          {status === 'connected' ? (
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <Text style={{ color: 'var(--sketch-green, #4caf50)', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                ✓ Connecté via NextGraph
              </Text>
              <Button variant="primary" onClick={() => navigate('home')} style={{ width: '100%' }}>
                Continuer vers l'accueil
              </Button>
            </div>
          ) : status === 'connecting' ? (
            <Button disabled style={{ width: '100%', opacity: 0.6 }}>
              Connexion NextGraph en cours...
            </Button>
          ) : (
            <div>
              <Button
                variant="primary"
                onClick={handleNgLogin}
                style={{ width: '100%' }}
              >
                Se connecter avec NextGraph
              </Button>
              {status === 'error' && (
                <Text style={{ textAlign: 'center', fontSize: 12, color: 'var(--sketch-gray)', marginTop: 8 }}>
                  NextGraph non disponible — mode démonstration
                </Text>
              )}
            </div>
          )}
        </div>

        <Divider />

        {/* Classic email/password login (mockup) */}
        <Text style={{ textAlign: 'center', fontSize: 14, color: 'var(--sketch-gray)', margin: '16px 0' }}>
          ou connexion classique (démo)
        </Text>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text style={{ marginBottom: 4, fontSize: 14 }}>Email</Text>
            <Input type="email" placeholder="vous@exemple.com" />
          </div>

          <div>
            <Text style={{ marginBottom: 4, fontSize: 14 }}>Mot de passe</Text>
            <Input type="password" placeholder="••••••••" />
          </div>

          <Button onClick={() => navigate('home')}>
            Se connecter
          </Button>

          <Text style={{ textAlign: 'center', fontSize: 14, color: 'var(--sketch-gray)' }}>
            Mot de passe oublié ?
          </Text>
        </div>

      </div>

      <Text style={{ textAlign: 'center', fontSize: 14, color: 'var(--sketch-gray)' }}>
        Pas encore de compte ? S'inscrire
      </Text>
    </div>
  );
}
