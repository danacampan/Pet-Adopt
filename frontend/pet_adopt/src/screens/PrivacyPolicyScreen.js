import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicyScreen = () => {
  return (
    <Container className="white-container small-container">
      <Helmet>
        <title>Politica de Confidențialitate</title>
      </Helmet>
      <h1 className="my-3 be-vietnam-pro-semibold">
        Politica de Confidențialitate
      </h1>
      <br></br>
      <div className="be-vietnam-pro-medium">
        <h3>Colectarea și Utilizarea Informațiilor</h3>
        <p>
          Această pagină este destinată să vă informeze despre practicile
          noastre în ceea ce privește colectarea, utilizarea și divulgarea
          informațiilor personale atunci când utilizați serviciul nostru.
        </p>
        <p>
          Noi colectăm anumite informații atunci când utilizați serviciul
          nostru, inclusiv:
          <ul>
            <li>
              Informații de identificare personală, cum ar fi numele și adresa
              de email, pe care le furnizați voluntar atunci când vă
              înregistrați pentru un cont.
            </li>
            <li>
              Informații de contact, cum ar fi adresa de email, pe care le
              furnizați pentru a primi comunicări de la noi.
            </li>
            <li>Informațiile furnizate în cadrul formularului de adopție a </li>
          </ul>
        </p>
        <h3>Divulgarea Informațiilor</h3>
        <p>
          Noi nu vom vinde, transfera sau distribui informațiile dumneavoastră
          personale altor părți terțe fără consimțământul dumneavoastră, cu
          excepția cazurilor în care acest lucru este necesar pentru a oferi
          serviciul solicitat sau în cazurile în care suntem obligați să facem
          acest lucru în conformitate cu legea.
        </p>
        <h3>Securitatea</h3>
        <p>
          Noi luăm măsuri pentru a proteja informațiile dumneavoastră personale
          împotriva accesului neautorizat, utilizării sau divulgării lor. Cu
          toate acestea, rețineți că niciun mijloc de transmitere prin internet
          sau stocare electronică nu este complet securizat și nu putem garanta
          securitatea absolută a informațiilor dumneavoastră.
        </p>
        <h3>Modificări la Politica de Confidențialitate</h3>
        <p>
          Ne rezervăm dreptul de a actualiza periodic politica noastră de
          confidențialitate. Vă vom informa cu privire la orice modificări
          publicând noua politică de confidențialitate pe această pagină.
        </p>
        <p>
          Pentru întrebări sau nelămuriri suplimentare, vă rugăm să ne
          contactați la adresa <strong>petadopt38@gmail.com</strong>.
        </p>
        <Link to={`/signup`}>Inapoi</Link>
      </div>
    </Container>
  );
};

export default PrivacyPolicyScreen;
