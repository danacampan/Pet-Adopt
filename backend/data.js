import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Dana',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('parola'),
      isAdmin: true,
    },
    {
      name: 'Maria',
      email: 'maria@example.com',
      password: bcrypt.hashSync('maria'),
      isAdmin: false,
    },
  ],
  pets: [
    {
      name: 'Thomas',
      slug: 'thomas',
      breed: 'cat',
      age: '3 ani',
      gender: 'Masculin',
      address: 'Adapost Timisoara, Strada Cluj',
      description: 'Foarte iubitor',
      medical_info: 'Sanatos',
      adoption_status: 'Disponibil',
      photos: ['/images/cat1.jpg', '/images/cat1.jpg', '/images/cat1.jpg'],
    },
    {
      name: 'Lila',
      slug: 'lila',
      breed: 'British shorthair',
      age: '3 ani',
      gender: 'Feminin',
      address: 'Adapost Timisoara, Strada Cluj',
      description: 'Iubeste tonul',
      medical_info: 'Sanatoasa',
      adoption_status: 'Disponibil',
      photos: ['/images/cat2.jpg'],
    },
    {
      name: 'Pufulet',
      slug: 'pufulet',
      breed: 'Pisica',
      age: '2 luni',
      gender: 'Feminin',
      address: 'Adapost Timisoara, Strada Cluj',
      description: 'Foarte jucausa',
      medical_info: 'Sanatoasa',
      adoption_status: 'Indisponibil',
      photos: ['/images/cat3.jpg'],
    },
    {
      name: 'Daisy',
      slug: 'daisy',
      breed: 'Caine Bichon',
      age: '6 luni',
      gender: 'Feminin',
      address: 'Adapost Timisoara, Strada Cluj',
      description:
        'Cuminte si ascultatoare, in cautarea unui stapan pe masura.',
      medical_info: 'Sanatoasa',
      adoption_status: 'Disponibil',
      photos: ['/images/dog1.jpg'],
    },
  ],
};
export default data;
