/* eslint-disable global-require */
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
    res.render('pages/common/login', {
      req,
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
    res.render('pages/common/signup', {
      req,
      title: 'Registrarse como cliente',
      description: `Inscríbase en ${_.get(req, 'site.name')}, navegue por nuestra vitrina virtual, seleccione sus productos y pague online`,
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
    res.render('pages/common/signup-confirm', {
      req,
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
    res.render('pages/common/password-reset', {
      req,
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
    res.render('pages/common/password-reset-confirm', {
      req,
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
    res.render('pages/common/logout', {
      req,
      title: 'Sesión finalizada',
      breadcrumbs,
      js: 'page',
    });
  });
};
