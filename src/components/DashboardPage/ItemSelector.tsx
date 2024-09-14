import { Text, VStack, Divider, HStack, IconButton } from "@chakra-ui/react";
import { FixtureName } from "../../contexts/KaleidoscopeContext";
import "./../fixturebox.scss"
import { MdAdd, MdRemove } from "react-icons/md";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useThemeColors } from "../../contexts/ThemeContext";


interface ItemSelectorProps {
    allTiles: FixtureName[];
    selectedTiles: FixtureName[];
    setSelectedTiles: React.Dispatch<React.SetStateAction<FixtureName[]>>;
}

  
  function ItemSelector({ allTiles, selectedTiles, setSelectedTiles }: ItemSelectorProps) {

    const { primary, secondary, bwForeground, indicator } = useThemeColors();


    return (
      <VStack align={"start"}>
        <Text>Select tiles and configure their order.</Text>
        <Divider></Divider>
        <Text>Selected</Text>
  
          <Droppable droppableId="selectedTiles">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {selectedTiles.map((tile, index) => (
                  <Draggable
                    key={tile.original}
                    draggableId={tile.original}
                    index={index}
                  >
                    {(provided) => (
                      <HStack
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={tile.original}
                        bg={secondary}
                      >
                        <Text>{tile.display}</Text>
                        <IconButton
                          isRound={true}
                          padding={"0"}
                          aria-label="remove"
                          icon={<MdRemove />}
                          onClick={() =>
                            setSelectedTiles((selected) =>
                              selected.filter(
                                (value) => value.original !== tile.original
                              )
                            )
                          }
                        />
                      </HStack>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
  
        <Text>Available</Text>
  
        <VStack align={"start"}>
          {allTiles
            .filter(
              (tile) =>
                selectedTiles.findIndex(
                  (selected) => selected.original === tile.original
                ) === -1
            )
            .map((unselected) => (
              <HStack key={unselected.original}>
                <IconButton
                  aria-label={"add"}
                  icon={<MdAdd />}
                  isRound={true}
                  onClick={() =>
                    setSelectedTiles((selected) => [...selected, unselected])
                  }
                />
                <Text>{unselected.display}</Text>
              </HStack>
            ))}
        </VStack>
      </VStack>
    );
  }

export default ItemSelector;