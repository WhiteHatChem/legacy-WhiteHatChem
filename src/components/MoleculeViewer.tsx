import { ReactNode, useEffect, useRef, useState } from "react";
import { Box } from 'lucide-react';
import { getSDF } from "../common/api";
import { useDataLoader } from "../common/hooks";
import { Spinner } from "./components";

interface MoleculeViewerProps {
  children: ReactNode
  _id: string;
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

export default function MoleculeViewer({ children, _id }: MoleculeViewerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [view3D, setView3D] = useState(false);
  const sdf_loader = useDataLoader<string>();
  const nglScriptLoaded = useScript("/ngl.js");

  useEffect(() => {
    const abortController = new AbortController();
    let handler = async () => {
      sdf_loader.setLoading();
      try {
        const _data = await getSDF( _id, abortController );
        sdf_loader.setData(_data)
      } catch (e: any) {
        sdf_loader.setError(e.message)
      }
    }

    handler()
    return () => {
      abortController.abort()
    }
  }, [_id])

  // Load NGL
  useEffect(() => {
    if (!view3D || !nglScriptLoaded || !sdf_loader.data) return;

    // @ts-ignore
    var stage = new NGL.Stage( "glmol", {cameraFov: 10} );
    
    // Handle window resizing
    window.addEventListener( "resize", function( event ){
        stage.handleResize();
    }, false );

    var blob = new Blob([sdf_loader.data.data], { type: 'text/plain' });
    var file = new File([blob], "foo.sdf", {type: "text/plain"});
    stage.loadFile( file , { defaultRepresentation: true } );

  }, [view3D, sdf_loader.data]);

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


  return <div className="relative flex justify-center w-full max-w-xl mb-4" ref={rootRef}>
    {
      !view3D ?  children :
      sdf_loader.loading ? <div className="w-full h-[400px]"><Spinner /></div> :
      sdf_loader.error ? <p className="text-red-400 w-full h-96">
        Service under maintenance, couldn't fetch data: {sdf_loader.error.message}
      </p> :
      sdf_loader.data ? <div id="glmol" className="w-full h-[400px]"/>
      : null
    }
    <button
      onClick={() => setView3D(!view3D)}
      className={`
        absolute top-0 right-0 py-1 px-3
        flex items-center gap-2 rounded-lg
        ${
            view3D ?
            "bg-neutral-800 dark:bg-neutral-200 text-neutral-200 dark:text-neutral-800" :
            "bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
          }
      `}
    >
      <Box size={20}/>
      3D
    </button>
  </div>
}