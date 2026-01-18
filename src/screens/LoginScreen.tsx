import React from 'react';
import { Button, Input, Title, Text } from '../components/sketchy';
import type { ScreenProps } from './index';

export function LoginScreen({ navigate }: ScreenProps) {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Title style={{ textAlign: 'center', fontSize: 32, marginBottom: 8 }}>Festipod</Title>
        <Text style={{ textAlign: 'center', marginBottom: 32 }}>Créez et rejoignez des événements entre amis</Text>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text style={{ marginBottom: 4, fontSize: 14 }}>Email</Text>
            <Input type="email" placeholder="vous@exemple.com" />
          </div>

          <div>
            <Text style={{ marginBottom: 4, fontSize: 14 }}>Mot de passe</Text>
            <Input type="password" placeholder="••••••••" />
          </div>

          <Button variant="primary" onClick={() => navigate('home')}>
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
