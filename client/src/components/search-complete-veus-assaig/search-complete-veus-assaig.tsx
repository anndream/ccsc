import { Veu } from "model";
import React from "react";
import { useAPI } from "../../helpers";
import { SearchComplete } from "../../standalone/search-complete";
import { SearchCompleteBaseProps } from "../../standalone/search-complete/search-complete";
import { searchFilter } from "../../utils";

interface SearchCompleteVeusAssaigProps extends SearchCompleteBaseProps {
  idAssaig: number;
}

const SearchCompleteVeusAssaig: React.FC<SearchCompleteVeusAssaigProps> = ({
  idAssaig,
  onSelect,
}) => {
  const [veus, loadingVeus, getVeus] = useAPI<Veu[]>(
    `/assajos/${idAssaig}/veus`,
    []
  );

  return (
    <SearchComplete
      data={veus}
      onSelect={(value, option) =>
        onSelect(value, option).then(() => getVeus())
      }
      filter={(value, veu) =>
        searchFilter(value, {
          texts: [veu.nom, veu.abreviatura],
        })
      }
      placeholder="Afegeix veus convocades"
      loading={loadingVeus}
      optionRenderObject={(veu) => ({
        key: veu.id_veu,
        value: veu.id_veu.toString(),
        label: veu.nom,
      })}
    />
  );
};

export default SearchCompleteVeusAssaig;