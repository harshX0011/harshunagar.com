/**
 * Runs before first paint: marks JS as available (for the orrery's scroll mode)
 * and sets the theme from the saved choice or the system setting, so there is no flash.
 */
const script = `(function(){var d=document.documentElement;d.classList.add('js');var t=null;try{t=localStorage.getItem('theme')}catch(e){}if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t)})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
