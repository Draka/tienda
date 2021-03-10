/**
 * Aunque no lo crea, este script permite usar la funcionalidad de ts que exporta a un solo archivo
 * usarse en una página sin cargar módulos, sin complejidad y con menos líneas
 */
const System: any = {
  functions: {},
  register: (name: any, requires: Array<string>, cb: any) => {
    System.functions[name] = { requires, cb };
  },
  active: () => {
    $.each(System.functions, (name, fc) => {
      const m = fc.cb(
        (nameClass: string, fcClass: any) => {
          fc[nameClass] = fcClass;
        },
        { id: name },
      );
      $.each(m.setters, (i, fcs) => {
        fcs(System.functions[fc.requires[i]]);
      });
      m.execute();
    });
  },
};
