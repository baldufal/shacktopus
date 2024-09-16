import { Box, VStack, Text } from "@chakra-ui/react"
import { FixtureName } from "../../contexts/KaleidoscopeContext"
import ThermocontrolDetails from "../HeatingPage/Thermocontrol/ThermocontrolDetails"
import AuxBox, { AUX_BOXES, AuxBoxType } from "../HeatingPage/Thermocontrol_aux/AuxBox"
import FixtureBox from "../KaleidoscopePage/FixtureBox"
import { FixturesData } from "../KaleidoscopePage/kaleidoscopeTypes"
import { IndicatorColors } from "../../contexts/ThemeContext"
import { ReactNode } from "react"

export const tileFromFixtureName = (tile: FixtureName, index: number, fixturesData: FixturesData | null, fixtureNames: FixtureName[] | null, indicator: IndicatorColors): ReactNode => 
{ return tile.original === "tc" ?
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

    }