/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/', require('./landpage'));

  app.get('/iniciar-sesion', (req, res) => {
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/iniciar-sesion',
        text: 'Iniciar Sesión',
        active: true,
      },
    ];

    res.render('pages/users/login', {
      session: req.user,
      title: 'Iniciar Sesión',
      description: 'Inicie sesión, hay muchos productos para que escoja de nuestra plaza de emprendedores',
      breadcrumbs,
      js: 'page',
    });
  });
  app.get('/registro', (req, res) => {
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/registro',
        text: 'Registro',
        active: true,
      },
    ];

    res.render('pages/users/signup', {
      session: req.user,
      title: 'Registrarse como cliente',
      description: `Inscríbase en ${appCnf.site.name}, navegue por nuestra vitrina virtual, seleccione sus productos y pague online`,
      breadcrumbs,
      js: 'page',
    });
  });
  app.get('/registro-confirmacion', (req, res) => {
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/registro-confirmacion',
        text: 'Iniciar Sesión',
        active: true,
      },
    ];
    res.render('pages/users/signup_confirm', {
      session: req.user,
      title: 'Registro Confirmación',
      breadcrumbs,
      js: 'page',
    });
  });
  app.get('/recuperar-contrasena', (req, res) => {
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/iniciar-sesion',
        text: 'Iniciar Sesión',
        active: true,
      },
    ];
    res.render('pages/users/password_reset', {
      session: req.user,
      title: '¿Olvidaste tu contraseña?',
      breadcrumbs,
      js: 'page',
    });
  });
  app.get('/recuperar-contrasena-confirmacion', (req, res) => {
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/iniciar-sesion',
        text: 'Iniciar Sesión',
        active: true,
      },
    ];
    res.render('pages/users/password_reset_confirm', {
      session: req.user,
      title: '¿Olvidaste tu contraseña?',
      breadcrumbs,
      js: 'page',
    });
  });
  app.get('/cerrar-sesion', (req, res) => {
    // elimina la cookie
    res.clearCookie('token');
    delete req.user;
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/cerrar-sesion',
        text: 'Cerrar Sesión',
        active: true,
      },
    ];
    res.render('pages/users/signout', {
      session: req.user,
      title: 'Sesión finalizada',
      breadcrumbs,
      js: 'page',
    });
  });
};
