import React, { useState } from 'react'
import { Box, Text } from '../../ink.js'
import { saveGlobalConfig } from '../../utils/config.js'
import { getCompanion, companionUserId, roll } from '../../buddy/companion.js'
import { RARITY_STARS } from '../../buddy/types.js'
import figures from 'figures'

// Generate a random companion name
function generateName(species: string): string {
  const prefixes = ['Little', 'Mr', 'Ms', 'Sir', 'Lady', 'Buddy', 'Pixel', 'Nugget', 'Bean', 'Floof']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  return `${prefix} ${species.charAt(0).toUpperCase() + species.slice(1)}`
}

// Generate random personality
function generatePersonality(): string {
  const personalities = [
    'cheerful and helpful',
    'curious and adventurous',
    'calm and wise',
    'energetic and playful',
    'gentle and caring',
  ]
  return personalities[Math.floor(Math.random() * personalities.length)]
}

export default function BuddyCommand(): React.ReactNode {
  const existingCompanion = getCompanion()
  const [hatched, setHatched] = useState(false)

  if (existingCompanion) {
    // Show existing companion info
    const { bones } = roll(companionUserId())
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="success">
          {figures.heart} Your Companion {figures.heart}
        </Text>
        <Text />
        <Text>
          <Text bold>Name:</Text> {existingCompanion.name}
        </Text>
        <Text>
          <Text bold>Species:</Text> {existingCompanion.species}
        </Text>
        <Text>
          <Text bold>Rarity:</Text> {RARITY_STARS[bones.rarity]} ({bones.rarity})
        </Text>
        <Text>
          <Text bold>Personality:</Text> {existingCompanion.personality}
        </Text>
        {bones.shiny && (
          <Text bold color="warning">
            {figures.star} SHINY! {figures.star}
          </Text>
        )}
        <Text />
        <Text dimColor>Type /buddy pet to pet your companion!</Text>
      </Box>
    )
  }

  if (hatched) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="success">
          {figures.heart} Hatching your companion... {figures.heart}
        </Text>
        <Text>This may take a moment!</Text>
      </Box>
    )
  }

  // Hatch a new companion
  const handleHatch = () => {
    const { bones, inspirationSeed } = roll(companionUserId())
    const name = generateName(bones.species)
    const personality = generatePersonality()

    saveGlobalConfig(currentConfig => ({
      ...currentConfig,
      companion: {
        name,
        personality,
        hatchedAt: Date.now(),
      },
    }))

    setHatched(true)
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="success">
        {figures.heart} Companion Buddy {figures.heart}
      </Text>
      <Text />
      <Text>You don't have a companion yet!</Text>
      <Text />
      <Text
        bold
        color="cyan"
        onPress={handleHatch}
      >
        {'> '}Hatch a new companion!{' <'}
      </Text>
      <Text dimColor>(Press Enter or click to hatch)</Text>
    </Box>
  )
}
