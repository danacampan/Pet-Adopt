import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: '30d',
    }
  );
};
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

/* export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
}; */

export const formEmailTemplate = (form) => {
  return `
  <body style="font-family: Arial, sans-serif;">

  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="text-align: center;">Confirmare cerere de adoptare</h2>
      
      <p>Bună ${form.firstName} ,</p>
      
      <p>Îți mulțumim că ai completat formularul nostru pentru adoptarea unui animal de companie. Mai jos găsești un rezumat al informațiilor furnizate:</p>
      
      <h3>Informații Personale:</h3>
      <p>
          <strong>Nume:</strong> ${form.firstName} ${form.lastName} <br>
          <strong>Email:</strong> ${form.email} <br>
          <strong>Număr de telefon:</strong> ${form.phone} <br>
          <strong>Numele animalului pe care doriți să-l adoptați:</strong> ${form.pet}
      </p>
      
      <h3>Adresă:</h3>
      <p>
          ${form.address}<br>
          ${form.city}, ${form.county}<br>
          <strong>Cod poștal:</strong> ${form.zip}<br>
          <strong>Țară:</strong> ${form.country}
      </p>
      
      <h3>Alte detalii:</h3>
      <p>
          <strong>Dețineți alte animale de companie?</strong> ${form.ownPets}<br>
          <strong>Locuiți în chirie sau dețineți casa?</strong> ${form.homeOwnership}<br>
          <strong>Aveți curte?</strong> ${form.yard}<br>
          <strong>Politica proprietarului referitoare la animalele de companie:</strong> ${form.landlordPolicy}<br>
          <strong>Ați abandonat vreodată un animal de companie?</strong> [Da/Nu]<br>
          <strong>Aveți copii în locuință?</strong> [Da/Nu] (Vârstele copiilor)<br>
          <strong>Câte ore pe zi va fi animalul lăsat singur?</strong> [Ore pe zi]<br>
          <strong>Unde va sta animalul dvs. de companie în cazul în care trebuie să plecați din oraș?</strong> [Locație]<br>
          <strong>Cum veți gestiona problemele comportamentale ale animalului dvs.?</strong> [Răspuns]<br>
          <strong>Ați fost vreodată condamnat pentru o infracțiune legată de animale?</strong> [Da/Nu]
      </p>
      
      <p>Vă mulțumim încă o dată pentru interesul dumneavoastră în adoptarea unui animal de companie. Vom analiza cererea dumneavoastră și vă vom contacta în cel mai scurt timp posibil.</p>
      
      <p>Cu stimă,<br>
      Echipa noastră de adopții</p>
  </div>
  `;
};
