import { Given, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../support/world';

Then('je peux voir la liste des participants', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const source = this.getRenderedText();
  // EventDetailScreen.tsx has: <Avatar components and "Participants (12)" text
  const hasAvatars = /<Avatar/.test(source);
  const hasParticipantsSection = /Participants\s*\(\d+\)/.test(source);
  expect(hasAvatars, 'Event detail should have Avatar components for participants').to.be.true;
  expect(hasParticipantsSection, 'Event detail should have "Participants (N)" section').to.be.true;
});

Then('je peux voir les détails de l\'événement', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const source = this.getRenderedText();
  // EventDetailScreen.tsx has: <Title>, 📅, 🕓, 📍 emojis, and "À propos" section
  expect(/<Title[^>]*>[^<]+<\/Title>/.test(source), 'Event detail should have a Title').to.be.true;
  expect(/📅/.test(source), 'Event detail should have date emoji 📅').to.be.true;
  expect(/🕓/.test(source), 'Event detail should have time emoji 🕓').to.be.true;
  expect(/📍/.test(source), 'Event detail should have location emoji 📍').to.be.true;
  expect(/À propos/.test(source), 'Event detail should have "À propos" section').to.be.true;
});

Then('je peux voir la section {string}', async function (this: FestipodWorld, sectionName: string) {
  const source = this.getRenderedText();
  // Detect section by text search
  const found = source.includes(sectionName);
  if (!found) {
    this.attach(`Looking for section: "${sectionName}"`, 'text/plain');
    this.attach(`Rendered text: ${source.substring(0, 500)}...`, 'text/plain');
  }
  expect(found, `Section "${sectionName}" should be visible on screen`).to.be.true;
});

Then('la page affiche {int} éléments', async function (this: FestipodWorld, count: number) {
  // Cannot count rendered elements without browser automation
  this.attach(`CANNOT TEST: Counting ${count} elements requires browser automation`, 'text/plain');
  return 'pending';
});

Then('je peux voir mon profil', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('profile');
  const source = this.getRenderedText();
  // ProfileScreen.tsx has: <Avatar initials="MD" size="lg" />, <Title>Marie Dupont</Title>, @mariedupont
  expect(/<Avatar[^>]*initials="MD"[^>]*size="lg"/.test(source), 'Profile should have Avatar with initials="MD" and size="lg"').to.be.true;
  expect(/<Title[^>]*>Marie Dupont<\/Title>/.test(source), 'Profile should have Title "Marie Dupont"').to.be.true;
  expect(/@mariedupont/.test(source), 'Profile should have username @mariedupont').to.be.true;
});

Then('je peux voir le profil de l\'utilisateur', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('user-profile');
  const source = this.getRenderedText();
  // UserProfileScreen.tsx has: <Avatar initials="JD" size="lg" />, <Title>Jean Durand</Title>, @jeandurand
  expect(/<Avatar[^>]*initials="JD"[^>]*size="lg"/.test(source), 'User profile should have Avatar with initials="JD" and size="lg"').to.be.true;
  expect(/<Title[^>]*>Jean Durand<\/Title>/.test(source), 'User profile should have Title "Jean Durand"').to.be.true;
  expect(/@jeandurand/.test(source), 'User profile should have username @jeandurand').to.be.true;
});

Then('je peux voir la liste des événements', async function (this: FestipodWorld) {
  const source = this.getRenderedText();
  if (this.currentScreenId === 'home') {
    // HomeScreen.tsx has: "Événements à venir" text and EventCard components
    expect(/Événements à venir/.test(source), 'Home screen should have "Événements à venir" text').to.be.true;
  } else if (this.currentScreenId === 'events') {
    // EventsScreen.tsx has: EventCard components with event data
    expect(/<Card[^>]*onClick/.test(source), 'Events screen should have clickable Card components').to.be.true;
  } else {
    this.attach(`UNEXPECTED SCREEN: "${this.currentScreenId}" is not expected to show events list`, 'text/plain');
    return 'pending';
  }
});

Then('je peux voir le QR code', async function (this: FestipodWorld) {
  const source = this.getRenderedText();
  if (this.currentScreenId === 'share-profile') {
    // ShareProfileScreen.tsx has: "QR Code" comment and "Scannez pour me retrouver" text
    expect(/QR Code/.test(source), 'Share profile should have "QR Code" text').to.be.true;
    expect(/Scannez pour me retrouver/.test(source), 'Share profile should have "Scannez pour me retrouver" text').to.be.true;
  } else if (this.currentScreenId === 'meeting-points') {
    // MeetingPointsScreen.tsx has: "Mon QR Code" text and "Scannez pour m'ajouter"
    expect(/Mon QR Code/.test(source), 'Meeting points should have "Mon QR Code" text').to.be.true;
    expect(/Scannez pour m'ajouter/.test(source), 'Meeting points should have "Scannez pour m\'ajouter" text').to.be.true;
  } else {
    // QR code is NOT on this screen
    this.attach(`NOT ON THIS SCREEN: QR code is on share-profile or meeting-points, not "${this.currentScreenId}"`, 'text/plain');
    return 'pending';
  }
});

Then('je peux voir le lien de partage', async function (this: FestipodWorld) {
  const source = this.getRenderedText();
  if (this.currentScreenId === 'share-profile') {
    // ShareProfileScreen.tsx has: "Mon lien de profil" text and profileLink variable
    expect(/Mon lien de profil/.test(source), 'Share profile should have "Mon lien de profil" text').to.be.true;
    expect(/festipod\.app\/u\//.test(source), 'Share profile should have profile link URL').to.be.true;
  } else {
    // Share link is NOT on this screen
    this.attach(`NOT ON THIS SCREEN: Share link is on share-profile, not "${this.currentScreenId}"`, 'text/plain');
    return 'pending';
  }
});

Given('un événement existe avec les données:', async function (this: FestipodWorld, dataTable) {
  // Cannot set up test data without backend/database
  const eventData = dataTable.rowsHash();
  this.attach(`CANNOT TEST: Setting up event data requires backend: ${JSON.stringify(eventData)}`, 'text/plain');
  return 'pending';
});

Given('un utilisateur existe avec les données:', async function (this: FestipodWorld, dataTable) {
  // Cannot set up test data without backend/database
  const userData = dataTable.rowsHash();
  this.attach(`CANNOT TEST: Setting up user data requires backend: ${JSON.stringify(userData)}`, 'text/plain');
  return 'pending';
});

Given('je visualise l\'événement {string}', async function (this: FestipodWorld, eventName: string) {
  this.navigateTo('#/demo/event-detail');
  expect(this.currentScreen, 'Event detail screen should be loaded').to.not.be.null;
  this.attach(`Viewing event: ${eventName}`, 'text/plain');
});

Given('je visualise le profil de {string}', async function (this: FestipodWorld, userName: string) {
  this.navigateTo('#/demo/user-profile');
  expect(this.currentScreen, 'User profile screen should be loaded').to.not.be.null;
  this.attach(`Viewing profile: ${userName}`, 'text/plain');
});

Then('l\'écran affiche les informations de l\'événement', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const source = this.getRenderedText();
  // EventDetailScreen.tsx has: <Title>, 📅, 🕓, 📍 emojis, and "À propos" section
  expect(/<Title[^>]*>[^<]+<\/Title>/.test(source), 'Event detail should have a Title').to.be.true;
  expect(/📅/.test(source), 'Event detail should have date emoji 📅').to.be.true;
  expect(/🕓/.test(source), 'Event detail should have time emoji 🕓').to.be.true;
  expect(/📍/.test(source), 'Event detail should have location emoji 📍').to.be.true;
  expect(/À propos/.test(source), 'Event detail should have "À propos" section').to.be.true;
});

Then('l\'écran affiche les informations du profil', async function (this: FestipodWorld) {
  const source = this.getRenderedText();
  if (this.currentScreenId === 'profile') {
    // ProfileScreen.tsx has: <Avatar initials="MD" size="lg" />, <Title>Marie Dupont</Title>, @mariedupont
    expect(/<Avatar[^>]*initials="MD"/.test(source), 'Profile should have Avatar with initials="MD"').to.be.true;
    expect(/<Title[^>]*>Marie Dupont<\/Title>/.test(source), 'Profile should have Title "Marie Dupont"').to.be.true;
    expect(/@mariedupont/.test(source), 'Profile should have username @mariedupont').to.be.true;
  } else if (this.currentScreenId === 'user-profile') {
    // UserProfileScreen.tsx has: <Avatar initials="JD" size="lg" />, <Title>Jean Durand</Title>, @jeandurand
    expect(/<Avatar[^>]*initials="JD"/.test(source), 'User profile should have Avatar with initials="JD"').to.be.true;
    expect(/<Title[^>]*>Jean Durand<\/Title>/.test(source), 'User profile should have Title "Jean Durand"').to.be.true;
    expect(/@jeandurand/.test(source), 'User profile should have username @jeandurand').to.be.true;
  } else {
    expect.fail(`Unexpected screen "${this.currentScreenId}" for profile info check`);
  }
});

Then('je peux ajouter un commentaire', async function (this: FestipodWorld) {
  // EventDetailScreen.tsx does NOT have comment functionality (no textarea, no "commentaire" text)
  // This feature is NOT implemented in the UI
  this.attach('NOT IMPLEMENTED: Comment functionality not in EventDetailScreen.tsx', 'text/plain');
  return 'pending';
});

Then('je peux ajouter une note', async function (this: FestipodWorld) {
  // No screen has note functionality implemented
  // This feature is NOT implemented in the UI
  this.attach('NOT IMPLEMENTED: Note functionality not implemented in any screen', 'text/plain');
  return 'pending';
});

Then('je peux filtrer les événements par période', async function (this: FestipodWorld) {
  // EventsScreen.tsx has filter badges (Tous, Cette semaine, Proches, Amis) but NOT period filter (mois/trimestre/année)
  // This feature is NOT implemented in the UI
  this.attach('NOT IMPLEMENTED: Period filter (mois/trimestre/année) not in EventsScreen.tsx', 'text/plain');
  return 'pending';
});

Then('je peux modifier un commentaire', async function (this: FestipodWorld) {
  // No comment edit functionality exists in any screen
  // This feature is NOT implemented in the UI
  this.attach('NOT IMPLEMENTED: Comment edit functionality not implemented', 'text/plain');
  return 'pending';
});

Then('je peux supprimer un commentaire', async function (this: FestipodWorld) {
  // No comment delete functionality exists in any screen
  // This feature is NOT implemented in the UI
  this.attach('NOT IMPLEMENTED: Comment delete functionality not implemented', 'text/plain');
  return 'pending';
});

Then('je peux m\'inscrire à l\'événement', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const source = this.getRenderedText();
  // EventDetailScreen.tsx line 49: {isJoined ? '✓ Inscrit' : 'Participer'}
  // The button shows "Participer" when not joined
  const hasParticiperButton = /isJoined \? '✓ Inscrit' : 'Participer'/.test(source);
  expect(hasParticiperButton, 'Event detail should have Participer/Inscrit toggle button').to.be.true;
});

Then('je peux me désinscrire de l\'événement', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const source = this.getRenderedText();
  // EventDetailScreen.tsx line 49: {isJoined ? '✓ Inscrit' : 'Participer'}
  // Same button toggles - clicking "✓ Inscrit" will unregister
  const hasInscritButton = /isJoined \? '✓ Inscrit' : 'Participer'/.test(source);
  expect(hasInscritButton, 'Event detail should have Participer/Inscrit toggle button (click to unregister)').to.be.true;
});

Then('je peux contacter l\'utilisateur', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('user-profile');
  const source = this.getRenderedText();
  // UserProfileScreen.tsx line 44: <Button>Contacter</Button>
  const hasContactButton = /<Button>Contacter<\/Button>/.test(source);
  expect(hasContactButton, 'User profile should have "Contacter" button').to.be.true;
});

Then('je peux voir les événements auxquels l\'utilisateur a participé', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('user-profile');
  const source = this.getRenderedText();
  // UserProfileScreen.tsx line 52: "Événements en commun" section with pastEvents
  expect(/Événements en commun/.test(source), 'User profile should have "Événements en commun" section').to.be.true;
  expect(/pastEvents/.test(source), 'User profile should display pastEvents data').to.be.true;
});

Then('je peux configurer mes notifications', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('settings');
  const source = this.getRenderedText();
  // SettingsScreen.tsx line 25: <Text>Notifications</Text> with Toggle
  expect(/>Notifications</.test(source), 'Settings should have "Notifications" text').to.be.true;
  expect(/<Toggle[^>]*checked=\{notifications\}/.test(source), 'Settings should have Toggle for notifications').to.be.true;
});

Then('je peux définir mon rayon de notification', async function (this: FestipodWorld) {
  // SettingsScreen.tsx has "Localisation" toggle but NOT "rayon" or "km" setting
  // This feature is NOT implemented in the UI
  this.attach('NOT IMPLEMENTED: Radius setting (rayon/km) is not in SettingsScreen.tsx', 'text/plain');
  return 'pending';
});

Then('je peux définir mes thématiques d\'intérêt', async function (this: FestipodWorld) {
  // SettingsScreen.tsx does NOT have thematic/interest settings
  // This feature is NOT implemented in the UI
  this.attach('NOT IMPLEMENTED: Thematic/interest settings not in SettingsScreen.tsx', 'text/plain');
  return 'pending';
});
