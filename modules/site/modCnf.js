const vars = {
  images: {
    favicon: {
      mimetype: ['image/vnd.microsoft.icon'],
      convert: [],
      ext: 'ico',
    },
    favpng: {
      mimetype: ['image/png'],
      convert: [],
      ext: 'png',
    },
    logoTop: {
      mimetype: ['image/svg+xml'],
      convert: [],
      ext: 'svg',
    },
    logoSquare: {
      mimetype: ['image/svg+xml'],
      convert: [],
      ext: 'svg',
    },
    logoEmail: {
      mimetype: ['image/jpeg', 'image/png'],
      convert: ['jpg'],
      ext: 'img',
    },
    social: {
      mimetype: ['image/jpeg', 'image/png'],
      convert: [],
      ext: 'img',
    },
  },
  styleBase: {
    'colors-sections': {
      primary: '#cc0000',
      secondary: '#000000',
      action: '#157215',
      info: '#1d64b3',
      error: '#9f3a38',
      alert: '#e1cb00',
      white: '#fff',
      black: '#000',
    },
    'colors-alpha': {
      20: '0.2',
    },
    opacity: {
      0: '0',
      1: '1',
    },
    transition: {
      3: 'all .3s',
    },
    'colors-variants': {
      300: '-10',
      500: '10',
    },
    breakpoints: {
      xs: '0px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    'layout-steps': '12',
    sizes: {
      small: '0.85',
      big: '1.25',
    },
    'sizes-text': {
      small: '0.85',
      big: '1.25',
      bigx2: '2.5',
      title: '1.2',
      subtitle: '1.1',
      social: '1.8',
    },
    spaces: {
      '0-25': '0.25em',
      '0-5': '0.5em',
      1: '1em',
      '1-5': '1.5em',
      2: '2em',
      3: '3em',
      4: '4em',
      5: '5em',
      'n3-5': '-3.5em',
      n50: '-50%',
    },
    'sizes-objects': {
      1: '1em',
      2: '2em',
      3: '3em',
      4: '4em',
      '1p': '1px',
      100: '100%',
      '48p': '48px',
      '96p': '96px',
      '170p': '170px',
      '230p': '230px',
      '460p': '460px',
      '100c2': 'calc(100% - 2em)',
    },
    'sizes-borders': {
      1: '1px',
      10: '10px',
    },
    'radius-borders': {
      '0-2': '.2em',
      '0-5': '.5em',
    },
    'edge-alignment': {
      0: '0',
      '0-5': '0.5em',
      1: '1em',
      2: '2em',
      4: '4em',
      5: '5em',
    },
    'modal-size': {
      xs: '320px',
      sm: '500px',
      md: '500px',
      lg: '500px',
      xl: '500px',
    },
    'modal-margin': {
      xs: '0px',
      sm: '10px',
      md: '20px',
      lg: '30px',
      xl: '40px',
    },
    navar: '4em',
    'stub-width': '350px',
    'font-size-base': '16px',
    'font-line-height': '1.15em',
    'font-family': "Lato, -apple-system, system-ui, BlinkMacSystemFont, Ubuntu, 'Helvetica Neue', sans-serif",
    'color-default': '#ebebeb !default',
    'color-background': '#ffffff !default',
    'color-foreground': '#000000 !default',
    'color-white': '#FFF',
    'color-black': '#000',
    'color-default-inv': '$color-foreground',
    'color-disabled': '#dfdfdf !default',
    'border-radius-base': '.2em',
  },
};
module.exports = vars;
