import { Box, Wrap, Text, Button, IconButton, VStack, Input, HStack } from "@chakra-ui/react";
import { useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import "./../fixturebox.scss"
import ItemSelector from "./ItemSelector";
import { useEffect, useMemo, useState } from "react";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../Router/AuthContext";
import { useThemeColors } from "../../contexts/ThemeContext";
import { FixtureName, obtainTiles } from "./obtainTiles";
import { tileFromFixtureName } from "./tileFromFixtureName";
import Fuse from 'fuse.js';


function DashboardPage() {
  const { userData, updateUserConfig } = useAuth();
  const { fixturesData, fixtureNames } = useKaleidoscope();
  const { indicator } = useThemeColors();
  const [modifyMode, setModifyMode] = useState<boolean>(false);

  const { allTiles: initialAllTiles, initialSelectedTiles } = useMemo(() => {
    return obtainTiles(fixtureNames, userData)
  }, [fixtureNames, userData]);;

  const [allTiles, setAllTiles] = useState<FixtureName[]>(initialAllTiles);
  const [selectedTiles, setSelectedTiles] = useState<FixtureName[]>(initialSelectedTiles);

  useEffect(() => {
    const { allTiles: initialAllTiles, initialSelectedTiles } = obtainTiles(fixtureNames, userData);
    setAllTiles(initialAllTiles);
    setSelectedTiles(initialSelectedTiles);
  }, [fixtureNames, userData]);

  const [searchResults, setSearchResults] = useState<FixtureName[]>(selectedTiles);
  const [searchString, setSearchString] = useState<string>("");
  const fuse = new Fuse(allTiles, { keys: ["display", "original"] });
  useEffect(() => {
    // If the user searched for an empty string,
    // display dashboard items.
    if (searchString.length === 0) {
      setSearchResults(selectedTiles);
      return;
    }

    const results = fuse.search(searchString);
    const items = results.map((result) => result.item);
    setSearchResults(items);
  }, [searchString, modifyMode]);

  return (
      <Box
        as="main"
        flex="1"
        p={4}
        paddingTop={0}
        width="100%">

        {modifyMode ?
          <VStack
            align={"start"}
            width={"100%"}>
            <Button
              onClick={() => {
                updateUserConfig({ dashboard: selectedTiles.map((tile) => tile.original) })
                setModifyMode(false)
              }}>
              Save and close</Button>
            <ItemSelector
              allTiles={allTiles}
              selectedTiles={selectedTiles}
              setSelectedTiles={setSelectedTiles} />
            <Button
              onClick={() => {
                updateUserConfig({ dashboard: selectedTiles.map((tile) => tile.original) })
                setModifyMode(false)
              }}>
              Save and close</Button>
          </VStack>
          :
          <>
            <IconButton
              position={"absolute"}
              top={"1rem"}
              right={"1rem"}
              onClick={() => setModifyMode(true)}
              aria-label={"edit dashboard"}
              icon={<MdEdit />}
            />
            <VStack
              alignItems={"start"}>
              <HStack width={"full"}>
                <Input
                  placeholder="Search all tiles"
                  value={searchString}
                  onChange={(event) => setSearchString(event.target.value)} />
                {searchString.length > 0 ?
                  <Button
                    onClick={() => setSearchString("")}
                  >Clear</Button>
                  : null}
              </HStack>

              {searchResults.length > 0 ?
                <Wrap>
                  {searchResults.map((tile, index) => {
                    return <div
                      key={tile.original}>
                      {tileFromFixtureName(tile, index, fixturesData, fixtureNames, indicator)}
                      <div key={tile.original} />
                    </div>
                  })}
                </Wrap>
                : (
                  selectedTiles.length > 0 ?
                    <Text>No tiles found. Clear search bar to display dashboard items.</Text> :
                    <>
                      <Text>No dashboard tiles selected.</Text>
                      <Text> You can select tiles via the button in the top right corner.</Text>
                    </>)}
            </VStack>

          </>
        }
      </Box>
  );
}

export default DashboardPage;