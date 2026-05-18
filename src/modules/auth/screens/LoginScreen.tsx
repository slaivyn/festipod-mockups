import { useEffect } from 'react';
import { Button, Input, Title, Text, Divider } from '../../../shared/components/sketchy';
import { useNextGraph } from '../../../shared/context/NextGraphContext';
import { useNavigate } from '../../../app/router';

export function LoginScreen() {
  const navigate = useNavigate();
  const { status, connect } = useNextGraph();

  useEffect(() => {
    if (status === 'connected') {
      navigate('/home');
    }
  }, [status]);

  const handleNgLogin = () => {
    if (status === 'connected') {
      navigate('/home');
    } else {
      connect();
    }
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Title style={{ textAlign: 'center', fontSize: 32, marginBottom: 8 }}>Festipod</Title>
        <Text style={{ textAlign: 'center', marginBottom: 32, color: '#888' }}>Créez et rejoignez des événements entre amis</Text>

        {/* NextGraph login */}
        <div style={{ marginBottom: 24 }}>
          {status === 'connected' ? (
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <Text style={{ color: '#22543D', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                ✓ Connecté via NextGraph
              </Text>
              <Button variant="primary" onClick={() => navigate('/home')} style={{ width: '100%' }}>
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
                <Text style={{ textAlign: 'center', fontSize: 12, color: '#888', marginTop: 8 }}>
                  NextGraph non disponible — mode démonstration
                </Text>
              )}
            </div>
          )}
        </div>

        <Divider />

        <Text style={{ textAlign: 'center', fontSize: 14, color: '#888', margin: '16px 0' }}>
          ou connexion classique (démo)
        </Text>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text style={{ marginBottom: 4, fontSize: 13, color: '#888' }}>Email</Text>
            <Input type="email" placeholder="vous@exemple.com" />
          </div>

          <div>
            <Text style={{ marginBottom: 4, fontSize: 13, color: '#888' }}>Mot de passe</Text>
            <Input type="password" placeholder="••••••••" />
          </div>

          <Button variant="primary" onClick={() => navigate('/home')}>
            Se connecter
          </Button>

          <Text style={{ textAlign: 'center', fontSize: 14, color: '#E8590C' }}>
            Mot de passe oublié ?
          </Text>
        </div>
      </div>

      <Text style={{ textAlign: 'center', fontSize: 14, color: '#888' }}>
        Pas encore de compte ? <span style={{ color: '#E8590C', cursor: 'pointer' }}>S'inscrire</span>
      </Text>
    </div>
  );
}
