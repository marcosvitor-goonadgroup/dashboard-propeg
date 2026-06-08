import logoSecom from '../images/logo_secom.png';
import logoMoovit from '../images/Moovit_Logo.png';
import logoCittamobi from '../images/logo_cittamobi.png';
import logoBibliaOn from '../images/logo_biblia_on.svg';
import logoDeezer from '../images/deezer_logo.png';
import logoCaixa from '../images/Caixa_Econômica_Federal_logo.png';
import { toSlug } from '../utils/slug';

// Mapeia logos por slug do nome (case/acento-insensível) para casar com o
// roteamento por slug usado nos dashboards.
const logosBySlug: Record<string, string> = {
  [toSlug('Secom')]: logoSecom,
  [toSlug('Moovit')]: logoMoovit,
  [toSlug('Cittamobi')]: logoCittamobi,
  [toSlug('Bíblia On')]: logoBibliaOn,
  [toSlug('Deezer')]: logoDeezer,
  [toSlug('Caixa Ecônomica Federal')]: logoCaixa
};

export const getClientLogo = (name: string): string | undefined =>
  logosBySlug[toSlug(name || '')];
