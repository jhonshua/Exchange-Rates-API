import nodemailer from 'nodemailer';

//  función sendMail
export function sendMail(email, username, rol_name, password) {
  // Creamos un objeto de correo electrónico
  const mail = {
    to: `${email}`,
    from: 'josepepes33321@gmail.com',
    subject: '¡Bienvenido a nuestra DENTALINK!',
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
        <style>
          p,
          a,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            font-family: 'Roboto', sans-serif !important;
          }
          h1 {
            font-size: 30px !important;
          }
          h2 {
            font-size: 25px !important;
          }
          h3 {
            font-size: 18px !important;
          }
          h4 {
            font-size: 16px !important;
          }
          p,
          a {
            font-size: 15px !important;
          }
    
          .claseBoton {
            width: 30%;
            background-color: #0a87c2;
            border: 2px solid ##0a87c2;
            color: black;
            padding: 16px 32px;
            text-align: center;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            transition-duration: 0.4s;
            cursor: pointer;
          }
          .claseBoton:hover {
            background-color: #11a9f0;
            color: #ffffff;
          }
          .imag {
            width: 20px;
            height: 20px;
          }
          .contA {
            margin: 0px 5px 0 5px;
          }
          .afooter {
            color: #ffffff !important;
            text-decoration: none;
            font-size: 13px !important;
          }
        </style>
      </head>
      <body>
        <div style="width: 100%; background-color: #e3e3e3">
          <div style="padding: 20px 10px 20px 10px">
            <!-- Imagen inicial -->
            <div
              style="
                background-color: #94d6e6;
                padding: 10px 0px 10px 0px;
                width: 100%;
                text-align: center;
              ">
              <img
                src="https://assets-global.website-files.com/6260453fffcdbe9f190e8e7d/631c115efdaad46cdefcdff4_Dentalink-Logo-p-500.png"
                alt=""
                style="width: 200px; height: 60px" />
            </div>
            <!-- Imagen inicial -->
    
            <!-- Contenido principal -->
            <div
              style="
                background-color: #ffffff;
                padding: 20px 0px 5px 0px;
                width: 100%;
                text-align: center;
              ">
              <h1>¡Bienvenido a nuestra DENTALINK!</h1>
    
              <p>¡Te damos la bienvenida! Tu cuenta ha sido creada exitosamente.</p>
              <p>Tu nombre de usuario es: ${username}</p>
              <p>Tu rol en la aplicación es: ${rol_name}</p>
              <p>Tu contraña es: ${password}</p>


              <!-- Gracias -->
              <p>Gracias por tu tiempo.</p>
              <img
              src="https://cdn-icons-png.freepik.com/256/1386/1386881.png?ga=GA1.1.894366557.1706152718&semt=ais"
              alt=""
              style="width: 70px; height: 60px" />
              <p style="margin-bottom: 50px">
                <i>Atentamente:</i><br />Equipo Dentalink.
              </p>
    
              <!-- Botón -->
              <a class="claseBoton" href="http://127.0.0.1:4000/"
                >Ya puedes ir a al aplicacion.</a
              >
            </div>
            <!-- Contenido principal -->
    
            <!-- Footer -->
            <div
              style="
                background-color: #282828;
                color: #ffffff;
                padding: 5px 0px 0px 0px;
                width: 100%;
                text-align: center;
              ">
              <h4>Soporte</h4>
          <p style="font-size: 13px; padding: 0px 20px 0px 20px">
            Comunícate con nosotros por los siguientes medios:<br />
            Correo:contactus.codeline@gmail.com <br />
            Whatsapp:
            <a class="afooter" href="https://wa.me/584122135572"
              >+584122135572</a
            ><br />
          </p>
          <p
                style="
                  background-color: rgb(99, 158, 171);
                  padding: 10px 0px 10px 0px;
                  font-size: 12px !important;
                ">
                © 2022 CODELINE, todos los derechos reservados.
              </p>
            </div>
            <!-- Footer -->
          </div>
        </div>
      </body>
    </html>
    
`
  };

  // Creamos un transportador
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'josepepes33321@gmail.com',
      pass: 'zhuv gdgy dsyc suuu'
    }
  });

  // Enviamos el correo electrónico
  transporter.sendMail(mail);
}
