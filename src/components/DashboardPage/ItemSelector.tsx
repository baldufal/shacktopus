import { Text, VStack, HStack, IconButton, Flex, Button, ButtonGroup } from "@chakra-ui/react";
import "./../fixturebox.scss"
import "./itemselector.scss"
import { MdCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { FixtureName, getIcon } from "./obtainTiles";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";


interface ItemSelectorProps {
  allTiles: FixtureName[];
  selectedTiles: FixtureName[];
  setSelectedTiles: React.Dispatch<React.SetStateAction<FixtureName[]>>;
}


function ItemSelector({ allTiles, selectedTiles, setSelectedTiles }: ItemSelectorProps) {


  return (
    <VStack
      width={"100%"}
      align={"start"}>
      <Text
        className="itemselectorheading"
      >Click on tiles to select or unselect them.</Text>
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
        <VStack
          align={"start"}
          className="fixturebox dropbox"
          spacing={0}
        >
          {selectedTiles.map((selected, selectedIndex) => (
            <ButtonGroup
              key={selected.original}
              className="dragitem"
              isAttached={true}
            >
              <IconButton
                isRound={true}
                aria-label="remove"
                bg={getIcon(selected).color}
                icon={getIcon(selected).icon}
                onClick={() =>
                  setSelectedTiles((tiles) =>
                    tiles.filter(
                      (value) => value.original !== selected.original
                    )
                  )
                }
              />
              <Button
                width={"250px"}
                onClick={() =>
                  setSelectedTiles((tiles) =>
                    tiles.filter(
                      (value) => value.original !== selected.original
                    )
                  )
                }
              >
                {selected.display.substring(0, 22)}
              </Button>
              <IconButton
                isRound={true}
                aria-label="move up"
                icon={<FaAngleUp />}
                onClick={() =>
                  setSelectedTiles((tiles) => {
                    const newTiles = [...tiles];
                    const [movedTile] = newTiles.splice(selectedIndex, 1);
                    if (selectedIndex > 0) {
                      newTiles.splice(selectedIndex - 1, 0, movedTile);
                    } else {
                      newTiles.push(movedTile);
                    }
                    return newTiles;
                  })
                }
              />
              <IconButton
                aria-label="move up"
                icon={<FaAngleDown />}
                onClick={() =>
                  setSelectedTiles((tiles) => {
                    const newTiles = [...tiles];
                    const [movedTile] = newTiles.splice(selectedIndex, 1);
                    if (selectedIndex < tiles.length - 1) {
                      newTiles.splice(selectedIndex + 1, 0, movedTile);
                    } else {
                      newTiles.unshift(movedTile);
                    }
                    return newTiles;
                  }
                  )
                }
              />
            </ButtonGroup>
          ))}
        </VStack>

        <Text>Available</Text>

        <div
          className="fixturebox dropbox"
        >
          {allTiles
            .filter(
              (tile) =>
                selectedTiles.findIndex(
                  (selected) => selected.original === tile.original
                ) === -1
            )
            .map((unselected) => (
              <ButtonGroup
                className="dragitem"
                isAttached={true}
              >
                <IconButton
                  isRound={true}
                  aria-label="add"
                  bg={getIcon(unselected).color}
                  icon={getIcon(unselected).icon}
                  onClick={() =>
                    setSelectedTiles((selected) => [...selected, unselected])
                  }
                />
                <Button
                  key={unselected.original}
                  width={"250px"}
                  onClick={() =>
                    setSelectedTiles((selected) => [...selected, unselected])
                  }
                >
                  {unselected.display.substring(0, 22)}
                </Button>
              </ButtonGroup>

            ))}
        </div>

      </Flex>
    </VStack>

  )
}

export default ItemSelector;