import { Box, Wrap, Text, Button, IconButton, VStack } from "@chakra-ui/react";
import { FixtureName, useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import "./../fixturebox.scss"
import ItemSelector from "./ItemSelector";
import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../Router/AuthContext";
import { useThemeColors } from "../../contexts/ThemeContext";
import { obtainTiles } from "./obtainTiles";
import { tileFromFixtureName } from "./tileFromFixtureName";

// Helper function to reorder list
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function DashboardPage() {
  const { userData, updateUserConfig } = useAuth();
  const { fixturesData, fixtureNames, error } = useKaleidoscope();
  const { indicator } = useThemeColors();

  const { allTiles, initialSelectedTiles } = obtainTiles(fixtureNames, userData);

  const [selectedTiles, setSelectedTiles] = useState<FixtureName[]>(initialSelectedTiles);

  const [modifyMode, setModifyMode] = useState<boolean>(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId === "selectedTiles"
      && result.destination.droppableId === "selectedTiles") {
      const reorderedTiles = reorder(
        selectedTiles,
        result.source.index,
        result.destination.index
      );

      setSelectedTiles(reorderedTiles);
    }

    if (result.source.droppableId === "selectedTiles"
      && result.destination.droppableId === "unselectedTiles") {
      setSelectedTiles((selected) =>
        selected.filter((_, index) => index !== result.source.index)
      );
    }

    if (result.source.droppableId === "unselectedTiles"
      && result.destination.droppableId === "selectedTiles") {

      setSelectedTiles((selected) => {
        const unselectedTiles = allTiles
          .filter(
            (tile) =>
              selectedTiles.findIndex(
                (selected) => selected.original === tile.original
              ) === -1
          );

        return [...selected.slice(0, result.destination!.index),
        unselectedTiles.at(result.source.index)!,
        ...selected.slice(result.destination!.index)];
      });
    }
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}>
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
            {selectedTiles.length > 0 ?
              <Wrap>
                {selectedTiles.map((tile, index) => {
                  return <div>
                  {tileFromFixtureName(tile, index, fixturesData, fixtureNames, indicator)}
                  <div></div>
                  </div>
                })}
              </Wrap>
              :
              <Text>No dashboard tiles selected.</Text>}
          </>
        }
      </Box>
    </DragDropContext>

  );
}

export default DashboardPage;