import type { UF } from '../types/geo';
import { ALL_UFS } from '../data/stateAbbreviations';

type Props = {
  selectedUf: UF | null;
  defaultColor: string;
  getStateColor: (uf: UF) => string;
  setDefaultColor: (color: string) => void;
  setStateColor: (uf: UF, color: string) => void;
  setAllStatesColor: (color: string) => void;
  resetStateColors: () => void;
  onSelectUf: (uf: UF) => void;
};

export function StateColorPanel({
  selectedUf,
  defaultColor,
  getStateColor,
  setDefaultColor,
  setStateColor,
  setAllStatesColor,
  resetStateColors,
  onSelectUf,
}: Props) {
  return (
    <section>
      <h3>Cores dos estados</h3>
      <label className="control-row">
        Cor global
        <input type="color" value={defaultColor} onChange={(e) => setDefaultColor(e.target.value)} />
      </label>
      <button type="button" onClick={() => setAllStatesColor(defaultColor)}>Aplicar cor global em todos</button>
      <button type="button" onClick={resetStateColors}>Restaurar padrão</button>

      <label className="control-row">
        Estado (UF)
        <select value={selectedUf ?? ''} onChange={(e) => onSelectUf(e.target.value as UF)}>
          <option value="">Selecione...</option>
          {ALL_UFS.map((uf) => (
            <option key={uf} value={uf}>{uf}</option>
          ))}
        </select>
      </label>

      {selectedUf ? (
        <label className="control-row">
          Cor de {selectedUf}
          <input type="color" value={getStateColor(selectedUf)} onChange={(e) => setStateColor(selectedUf, e.target.value)} />
        </label>
      ) : null}
    </section>
  );
}
