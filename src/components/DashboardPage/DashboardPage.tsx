import { Box, Wrap, Text, Button, Flex, Spacer } from "@chakra-ui/react";
import FixtureBox from "../KaleidoscopePage/FixtureBox";
import ThermocontrolDetails from "../HeatingPage/Thermocontrol/ThermocontrolDetails";
import { FixtureName, useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import "./../fixturebox.scss"
import ItemSelector from "./ItemSelector";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";


  // Helper function to reorder list
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  

function DashboardPage() {
    const { fixturesData, fixtureNames, error } = useKaleidoscope();

    const allTiles: FixtureName[] = [
        { display: "Thermocontrol", original: "tc" },
        ...(fixtureNames ? fixtureNames : [])
    ];

    const [selectedTiles, setSelectedTiles] = useState<FixtureName[]>([]);

    const [modifyMode, setModifyMode] = useState<boolean>(false);

    const onDragEnd = (result: any) => {
        if (!result.destination) {
          return;
        }
    
        const reorderedTiles = reorder(
          selectedTiles,
          result.source.index,
          result.destination.index
        );
    
        setSelectedTiles(reorderedTiles);
      };

    return (<>
        <DragDropContext onDragEnd={onDragEnd}>
        <Box as="main" flex="1" p={4} width="100%">

        <Flex paddingEnd={4}>
            <Spacer></Spacer>
            <Button onClick={() => setModifyMode((oldMode) => !oldMode)}>Edit Dashboard</Button>

        </Flex>
        {modifyMode? 
        <ItemSelector
        allTiles={allTiles}
        selectedTiles={selectedTiles}
        setSelectedTiles={setSelectedTiles} />
        : 
        <Wrap>

                {error ? <Text color={"red"}>{"Error reading Kaleidoscope data: " + error}</Text> :
                    fixtureNames && fixturesData ?
                        fixtureNames.map((fixtureName, index) =>
                            <FixtureBox
                                key={index}
                                fixtureName={fixtureName}
                                data={fixturesData.fixtures[fixtureName.original]} />)
                        : <Text>Loading...</Text>}
                <ThermocontrolDetails></ThermocontrolDetails>
            </Wrap>
        }
            


        </Box>
        </DragDropContext>

    </>
    );
}

export default DashboardPage;