import { useEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";

interface MoleculeViewerProps {
  children: ComponentChildren
  inchi: string;
}

const useScript = (url: string) => {
  const [scriptLoadedSuccessfully, setScriptLoadedSuccessfully] = useState<boolean>(false);

  useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.onload = () => {
      setScriptLoadedSuccessfully(true);
    };
    scriptTag.onerror = () => {
      setScriptLoadedSuccessfully(false);
    };

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return scriptLoadedSuccessfully;
}

export default function MoleculeViewer({ children, inchi }: MoleculeViewerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [view3D, setView3D] = useState(false);
  const [SDF, setSDF] = useState<string | null>(null);
  const nglScriptLoaded = useScript("/ngl.js");

  // Fetch SDF
  useEffect(() => {
    const abortController = new AbortController();
    try {
      fetch(
        `https://cactus.nci.nih.gov/chemical/structure/${inchi}/file?format=sdf&get3d=True`,
        { signal: abortController.signal }
      ).then((res) => res.text()).then((sdf) => setSDF(sdf));
    } catch (e) {
      if (!abortController.signal.aborted) {console.log(`Aborted: ${e}`)}
    }
    return () => abortController.abort();
  }, [inchi]);

  // Load NGL
  useEffect(() => {
    if (!view3D || !nglScriptLoaded || !SDF) return;

    // @ts-ignore
    var stage = new NGL.Stage( "glmol", {cameraFov: 10} );
    
    // Handle window resizing
    window.addEventListener( "resize", function( event ){
        stage.handleResize();
    }, false );

    var blob = new Blob([SDF], { type: 'text/plain' });
    var file = new File([blob], "foo.sdf", {type: "text/plain"});
    stage.loadFile( file , { defaultRepresentation: true } );

  }, [view3D, SDF]);

  // Set canvas background transparent
  useEffect(() => {
    if (rootRef.current) {
      const observer = new MutationObserver((mut, obs) => {
        mut.forEach((mutation) => {
          if (document.querySelector("#glmol canvas")) {
            // @ts-ignore
            document.querySelector("#glmol canvas").style.backgroundColor = "transparent";
          }
        })
      });
      observer.observe(rootRef.current, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [rootRef]);


  return <div class="relative flex justify-center w-full max-w-xl mb-4" ref={rootRef}>
    { !view3D ? children : <div id="glmol" class="w-full h-[400px]"/> }
    <button
      onClick={() => setView3D(!view3D)}
      class={`
        absolute top-0 right-0 py-1 px-3
        flex items-center gap-2 rounded-lg
        ${
            view3D ?
            "bg-neutral-800 dark:bg-neutral-200 text-neutral-200 dark:text-neutral-800" :
            "bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
          }
      `}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
      3D
    </button>
  </div>
}