import { Box, Button, VStack } from "@chakra-ui/react";
import { useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import "./../fixturebox.scss"
import ItemSelector from "./ItemSelector";
import { useEffect, useMemo, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useAuth } from "../Router/AuthContext";
import { FixtureName, obtainTiles } from "./obtainTiles";
import { useNavigate } from "react-router-dom";

// Helper function to reorder list
const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

function EditDashboardPage() {
    const navigate = useNavigate();

    const { userData, updateUserConfig } = useAuth();
    const { fixtureNames } = useKaleidoscope();

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


                <VStack
                    align={"start"}
                    width={"100%"}>
                    <Button
                        onClick={() => {
                            updateUserConfig({...userData!.userConfig, dashboard: selectedTiles.map((tile) => tile.original) })
                            navigate("/");
                        }}>
                        Save and close</Button>
                    <ItemSelector
                        allTiles={allTiles}
                        selectedTiles={selectedTiles}
                        setSelectedTiles={setSelectedTiles} />
                    <Button
                        onClick={() => {
                            updateUserConfig({...userData!.userConfig, dashboard: selectedTiles.map((tile) => tile.original) })
                            navigate("/");
                        }}>
                        Save and close</Button>
                </VStack>

            </Box>
        </DragDropContext>

    );
}

export default EditDashboardPage;