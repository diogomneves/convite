# Convite de casamento — primeira versão

Site mobile-first inspirado no convite em vídeo enviado como referência. Inclui:

- animação de abertura com envelope + selo de cera;
- hero em estilo aguarela;
- contagem decrescente;
- história do casal;
- cerimónia e festa;
- programa em timeline;
- formulário RSVP responsivo;
- integração opcional com Supabase;
- personalização de convidado por URL (`?convidado=João%20Silva`).

## 1. Ver o site

A forma mais simples é abrir `index.html` no browser.

Para servir localmente com um servidor HTTP:

```bash
python3 -m http.server 8080
```

Depois abrir `http://localhost:8080`.

## 2. Alterar nomes, data e conteúdo

Editar apenas `config.js`.

Os campos principais são:

- `couple.first` / `couple.second`
- `couple.initials`
- `date` e `dateLabel`
- `story`
- `ceremony`
- `reception`
- `schedule`
- `rsvpDeadline`

## 3. Ligar o RSVP ao Supabase

1. Criar um projeto Supabase.
2. Abrir o SQL Editor e executar `supabase.sql`.
3. Em Supabase > Project Settings > API copiar:
   - Project URL
   - anon public key
4. Colocar os dois valores em `config.js`:

```js
supabase: {
  url: 'https://SEU-PROJETO.supabase.co',
  anonKey: 'SUA-ANON-KEY'
}
```

Sem essas credenciais, o formulário funciona em modo de demonstração e guarda as respostas em `localStorage` apenas no browser atual.

## 4. Publicar

Pode ser publicado diretamente em Vercel, Netlify ou GitHub Pages porque é um site estático.

## Próximos passos recomendados

- substituir os nomes e dados reais;
- ajustar paleta às cores do casamento;
- substituir a arte abstrata por uma ilustração/aguarela do local real;
- adicionar uma área privada para consultar e exportar os RSVPs;
- configurar domínio próprio.
