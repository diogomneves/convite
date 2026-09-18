window.WEDDING_CONFIG = {
  couple: {
    first: 'NOME',
    second: 'NOME',
    initials: 'N & N'
  },
  date: '2027-09-12T15:00:00+01:00',
  dateLabel: '12 · SETEMBRO · 2027',
  intro: 'Há dias que ficam para sempre. Queremos muito que este seja um deles — contigo.',
  story: [
    {
      year: '2019',
      title: 'Onde tudo começou',
      text: 'Um pequeno momento, uma grande coincidência e o início da nossa história.'
    },
    {
      year: '2024',
      title: 'O “sim”',
      text: 'Entre nervos, sorrisos e muita emoção, decidimos que o próximo capítulo seria para sempre.'
    },
    {
      year: '2027',
      title: 'O nosso dia',
      text: 'Agora só falta celebrar com as pessoas que fazem parte da nossa vida.'
    }
  ],
  ceremony: {
    title: 'Cerimónia',
    time: '15:00',
    venue: 'Nome da Igreja / Local',
    address: 'Morada da cerimónia',
    mapUrl: '#'
  },
  reception: {
    title: 'Festa',
    time: '17:00',
    venue: 'Nome da Quinta',
    address: 'Morada da quinta',
    mapUrl: '#'
  },
  schedule: [
    ['15:00', 'Cerimónia'],
    ['16:30', 'Cocktail'],
    ['18:00', 'Jantar'],
    ['21:30', 'Corte do bolo'],
    ['22:00', 'Festa']
  ],
  rsvpDeadline: 'Confirma, por favor, até 12 de julho de 2027.',
  footer: 'Mal podemos esperar para celebrar contigo.',
  supabase: {
    // Preenche para guardar respostas no Supabase. Se ficar vazio, o formulário
    // funciona em modo de demonstração e guarda a resposta apenas neste browser.
    url: '',
    anonKey: ''
  }
};
