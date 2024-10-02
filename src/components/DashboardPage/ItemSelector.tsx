import { Text, VStack, HStack, IconButton, Flex } from "@chakra-ui/react";
import "./../fixturebox.scss"
import "./itemselector.scss"
import { MdAdd, MdCheckBox, MdOutlineCheckBoxOutlineBlank, MdRemove } from "react-icons/md";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { useThemeColors } from "../../contexts/ThemeContext";
import { FixtureName } from "./obtainTiles";


interface ItemSelectorProps {
  allTiles: FixtureName[];
  selectedTiles: FixtureName[];
  setSelectedTiles: React.Dispatch<React.SetStateAction<FixtureName[]>>;
}


function ItemSelector({ allTiles, selectedTiles, setSelectedTiles }: ItemSelectorProps) {

  const { secondary, bwForeground } = useThemeColors();

  return (
    <VStack
    width={"100%"}
      align={"start"}>
      <Text
        className="itemselectorheading"
      >Select tiles and determine their order by dragging.</Text>
      <HStack>
        <IconButton
          aria-label={"select all"}
          icon={<MdCheckBox />}
          onClick={() => setSelectedTiles(allTiles)}
        />
        <IconButton
          aria-label={"deselect all"}
          icon={<MdOutlineCheckBoxOutlineBlank />}
          onClick={() => setSelectedTiles([])}
        />
      </HStack>
      <Flex
        direction={['column', 'column', 'row']} // Column for mobile, row for larger screens
        align={"start"}
        gap={8} // Spacing between the lists
        className="itemselectorstack">


        <Text>Selected</Text>
        <Droppable droppableId="selectedTiles">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="fixturebox dropbox"
            >
              {selectedTiles.map((selected, selectedIndex) => (
                <Draggable
                  key={selected.original}
                  draggableId={selected.original}
                  index={selectedIndex}
                >
                  {(provided) => (
                    <HStack
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      key={selected.original}
                      bg={secondary}
                      className="dragitem"
                    >
                      <IconButton
                        isRound={true}
                        padding={"0"}
                        aria-label="remove"
                        icon={<MdRemove />}
                        onClick={() =>
                          setSelectedTiles((tiles) =>
                            tiles.filter(
                              (value) => value.original !== selected.original
                            )
                          )
                        }
                      />
                      <Text
                        color={bwForeground}>
                        {selected.display}</Text>
                    </HStack>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Text>Available</Text>

        <Droppable droppableId="unselectedTiles">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="fixturebox dropbox"
            >
              {allTiles
                .filter(
                  (tile) =>
                    selectedTiles.findIndex(
                      (selected) => selected.original === tile.original
                    ) === -1
                )
                .map((unselected, unselectedIndex) => (
                  <Draggable
                    key={unselected.original}
                    draggableId={unselected.original}
                    index={unselectedIndex}
                  >
                    {(provided) => (
                      <HStack
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={unselected.original}
                        bg={secondary}
                        className="dragitem"
                      >
                        <IconButton
                          aria-label={"add"}
                          icon={<MdAdd />}
                          isRound={true}
                          onClick={() =>
                            setSelectedTiles((selected) => [...selected, unselected])
                          }
                        />
                        <Text
                          color={bwForeground}>
                          {unselected.display}</Text>
                      </HStack>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Flex>
    </VStack>

  )
}

export default ItemSelector;