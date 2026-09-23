export type SharkAttackProps = {
  id: number;
  fecha: string | null;
  año: number | null;
  tipo: string | null;
  país: string | null;
  área: string | null;
  ubicación: string | null;
  actividad: string | null;
  nombre: string | null;
  sexo: string | null;
  edad: number | null;
  lesión: string | null;
  fatal_s_n: string | null;
  hora: string | null;
  especie: string | null;
  investigador_o_fuente: string | null;
  pdf: string | null;
  formula_enlace: string | null;
  enlace: string | null;
  número_de_caso: string | null;
  número_de_caso_0: string | null;
};

export class SharkAttack {
  private readonly _id: number;

  private props: SharkAttackProps;

  constructor(props: SharkAttackProps) {
    if (!Number.isInteger(props.id)) {
      throw new Error('Shark attack id must be an integer');
    }

    if (props.id <= 0) {
      throw new Error('Shark attack id must be greater than zero');
    }

    this._id = props.id;
    this.props = {
      ...props,
    };
  }

  get id(): number {
    return this._id;
  }

  get fecha(): string | null {
    return this.props.fecha;
  }

  get año(): number | null {
    return this.props.año;
  }

  get tipo(): string | null {
    return this.props.tipo;
  }

  get país(): string | null {
    return this.props.país;
  }

  get área(): string | null {
    return this.props.área;
  }

  get ubicación(): string | null {
    return this.props.ubicación;
  }

  get actividad(): string | null {
    return this.props.actividad;
  }

  get nombre(): string | null {
    return this.props.nombre;
  }

  get sexo(): string | null {
    return this.props.sexo;
  }

  get edad(): number | null {
    return this.props.edad;
  }

  get lesión(): string | null {
    return this.props.lesión;
  }

  get fatal_s_n(): string | null {
    return this.props.fatal_s_n;
  }

  get hora(): string | null {
    return this.props.hora;
  }

  get especie(): string | null {
    return this.props.especie;
  }

  get investigador_o_fuente(): string | null {
    return this.props.investigador_o_fuente;
  }

  get pdf(): string | null {
    return this.props.pdf;
  }

  get formula_enlace(): string | null {
    return this.props.formula_enlace;
  }

  get enlace(): string | null {
    return this.props.enlace;
  }

  get número_de_caso(): string | null {
    return this.props.número_de_caso;
  }

  get número_de_caso_0(): string | null {
    return this.props.número_de_caso_0;
  }

  update(data: Partial<Omit<SharkAttackProps, 'id'>>): void {
    this.props = {
      ...this.props,
      ...data,
    };
  }

  toPrimitives(): SharkAttackProps {
    return {
      ...this.props,
      id: this._id,
    };
  }
}