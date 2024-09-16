import { Box, Wrap, Text, Button, Flex, Spacer, IconButton, VStack } from "@chakra-ui/react";
import FixtureBox from "../KaleidoscopePage/FixtureBox";
import ThermocontrolDetails from "../HeatingPage/Thermocontrol/ThermocontrolDetails";
import { FixtureName, useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import "./../fixturebox.scss"
import ItemSelector from "./ItemSelector";
import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../Router/AuthContext";
import { useThemeColors } from "../../contexts/ThemeContext";
import AuxBox, { AUX_BOXES, AuxBoxType } from "../HeatingPage/Thermocontrol_aux/AuxBox";


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


  // These are the tiles that we currently receive from the APIs
  const currentAvailableTiles = [{ display: "Thermocontrol", original: "tc" },
  ...AUX_BOXES,
  ...(fixtureNames ? fixtureNames : [])]

  // These are the favorites that we loaded from the backend server
  const savedFavoriteTiles = userData ? userData.userConfig.dashboard.map((dashboardItem) =>
    currentAvailableTiles.find((tile) => tile.original === dashboardItem) || { original: dashboardItem, display: dashboardItem }
  ) : [];

  // To get all possible tiles we combine all currentAvailableTiles
  // with those savedFavoriteTiles, that have no pendant in currentAvailableTiles
  const allTiles: FixtureName[] = [
    ...currentAvailableTiles,
    ...savedFavoriteTiles
  ].filter((tile, index, self) =>
    index === self.findIndex((t) => t.original === tile.original)
  ).sort((a, b) => a.display.localeCompare(b.display));

  const [selectedTiles, setSelectedTiles] = useState<FixtureName[]>(
    userData ?
      userData.userConfig.dashboard.map((dashboardItem) =>
        allTiles.find((tile) => tile.original === dashboardItem))
        .filter((tile): tile is FixtureName => tile !== undefined) :
      []);

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
            <Flex >
              <Spacer></Spacer>
              <IconButton
                marginTop={-4}
                marginBottom={2}
                onClick={() => setModifyMode((oldMode) => !oldMode)}
                aria-label={"edit dashboard"}
                icon={<MdEdit />}
              />
            </Flex>
            {selectedTiles.length > 0 ?
              <Wrap>
                {selectedTiles.map((tile, index) => {
                  return tile.original === "tc" ?
                    <ThermocontrolDetails
                      key={index} />
                    :
                    AUX_BOXES.findIndex((aux_box) => aux_box.original === tile.original) > -1 ?
                      <AuxBox type={tile.original as AuxBoxType}></AuxBox>
                      :
                      (fixturesData && fixtureNames && fixturesData.fixtures[tile.original]) ?
                        <FixtureBox
                          key={index}
                          fixtureName={tile}
                          data={fixturesData.fixtures[tile.original]} />
                        :
                        <Box
                          key={index}
                          borderColor={indicator.error}
                          p={2}
                          className="fixturebox">
                          <VStack>
                            <Text>Currently not available:</Text>
                            <Text>{tile.display}</Text>
                          </VStack>
                        </Box>
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