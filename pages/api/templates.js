export default async function handler(req, res) {
  const templates = {
    accueil: {
      title: "Accueil",
      content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Accueil</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    h1 { color: #333; }
    .container { max-width: 600px; background: white; padding: 20px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Bienvenue</h1>
    <p>Ceci est votre page d'accueil.</p>
    <p>Modifiez ce contenu pour personnaliser votre site.</p>
  </div>
</body>
</html>`,
    },
    contact: {
      title: "Contact",
      content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Contact</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Nous contacter</h1>
  <form>
    <div class="form-group">
      <label>Nom</label>
      <input type="text" required>
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" required>
    </div>
    <div class="form-group">
      <label>Message</label>
      <textarea rows="5" required></textarea>
    </div>
    <button type="submit">Envoyer</button>
  </form>
</body>
</html>`,
    },
    blog: {
      title: "Blog",
      content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Blog</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    .post { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
    .post-date { color: #999; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>Blog</h1>
  <div class="post">
    <h2>Premier article</h2>
    <p class="post-date">Publié le 28 mai 2026</p>
    <p>Contenu de votre premier article...</p>
  </div>
</body>
</html>`,
    },
    about: {
      title: "À propos",
      content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>À propos</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { max-width: 600px; background: white; padding: 20px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>À propos de nous</h1>
    <p>Bienvenue sur notre page à propos.</p>
    <p>Racontez votre histoire, votre mission et votre vision.</p>
  </div>
</body>
</html>`,
    },
  };

  return res.status(200).json(templates);
}
