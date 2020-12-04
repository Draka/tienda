module.exports = (app) => {
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
      title: 'Iniciar Sesión',
      description: 'Inicie sesión, hay muchos productos para que escoja de nuestra plaza de emprendedores',
      breadcrumbs,
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
      title: 'Registrarse como cliente',
      description: 'Inscríbase en Tienda p4s, navegue por nuestra vitrina virtual, seleccione sus productos y pague online',
      breadcrumbs,
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
      title: 'Registro Confirmación',
      js: 'simple',
      breadcrumbs,
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
      title: '¿Olvidaste tu contraseña?',
      js: 'simple',
      breadcrumbs,
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
      title: '¿Olvidaste tu contraseña?',
      js: 'simple',
      breadcrumbs,
    });
  });
  app.get('/cerrar-sesion', (req, res) => {
    // elimina la cookie
    res.clearCookie('token');
    delete global.session;
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
      title: 'Sesión finalizada',
      js: 'simple',
      breadcrumbs,
    });
  });
};
