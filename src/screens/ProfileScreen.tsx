import React from 'react';
import { Header, Avatar, Title, Text, Button, Card, Divider, NavBar, Tag } from '../components/sketchy';
import type { ScreenProps } from './index';

export function ProfileScreen({ navigate }: ScreenProps) {
  const upcomingEvents = [
    { title: 'Forum Ouvert Transition', date: '22-23 fév.' },
    { title: 'Résidence Reconnexion', date: '16-20 fév.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Mon profil"
        right={<span onClick={() => navigate('settings')} style={{ cursor: 'pointer', fontSize: 18 }}>⚙</span>}
      />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Avatar name="Marie Dupont" color="#E8590C" size="lg" />
          <Title style={{ marginTop: 16, marginBottom: 4 }}>Marie Dupont</Title>
          <Text style={{ margin: 0, color: '#888' }}>@mariedupont</Text>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>12</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Événements</Text>
            </div>
            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('friends-list')}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>48</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Amis</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>156</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Participations</Text>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'center' }}>
            <Button variant="primary" onClick={() => navigate('update-profile')}>Modifier le profil</Button>
            <Button onClick={() => navigate('share-profile')}>Partager</Button>
          </div>
        </div>

        <Divider />

        {/* Mes intentions */}
        <div style={{
          margin: '12px 16px',
          padding: '14px 16px',
          background: 'linear-gradient(135deg, #FFF7ED, #FFFBF5)',
          borderRadius: 16,
          border: '1px solid #FDDCB5',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#C05621', marginBottom: 8 }}>
            Mes intentions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <Tag label="gouvernance coopérative" />
            <Tag label="communs numériques" />
            <Tag label="habitat participatif" color="#4a3000" bg="#e8f5e9" />
            <span
              onClick={() => navigate('intentions')}
              style={{ fontSize: 20, cursor: 'pointer', color: '#C05621', lineHeight: 1 }}
            >
              +
            </span>
          </div>
        </div>

        <Divider />

        <div style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Mes événements à venir</Text>
          {upcomingEvents.map((event, i) => (
            <Card key={i} onClick={() => navigate('event-detail')} style={{ marginBottom: 12 }}>
              <Text style={{ margin: 0, fontWeight: 'bold' }}>{event.title}</Text>
              <Text style={{ margin: '4px 0 0 0', fontSize: 13, color: '#888' }}>{event.date}</Text>
            </Card>
          ))}
          <Button style={{ width: '100%' }} onClick={() => navigate('events')}>
            Voir tous les événements
          </Button>
        </div>

        <Divider />

        <div style={{ padding: '0 16px 16px' }}>
          <div className="app-list-item" onClick={() => navigate('create-event')}>
            <span style={{ marginRight: 12 }}>+</span>
            <Text style={{ margin: 0 }}>Relayer un événement</Text>
          </div>
          <div className="app-list-item" onClick={() => navigate('friends-list')}>
            <span style={{ marginRight: 12 }}>👥</span>
            <Text style={{ margin: 0 }}>Mon réseau</Text>
          </div>
          <div className="app-list-item">
            <span style={{ marginRight: 12 }}>📜</span>
            <Text style={{ margin: 0 }}>Événements passés</Text>
          </div>
        </div>
      </div>

      <NavBar
        items={[
          { icon: '◎', label: 'Événements', onClick: () => navigate('home') },
          { icon: '⬡', label: 'Réseau', onClick: () => navigate('friends-list') },
          { icon: '◉', label: 'En direct', onClick: () => navigate('live') },
          { icon: '○', label: 'Profil', active: true },
        ]}
      />
    </div>
  );
}
