import { ProfileQueryType, SEARCH_COMMANDS, GRAPH_COMMANDS } from './constants'

export function generateGraphProfileQuery(query: string, type: ProfileQueryType) {
  return [`graph.${type.toLowerCase()}`, ...query.split(' ').slice(1)].join(' ')
}

export function generateSearchProfileQuery(query: string, type: ProfileQueryType) {
  const commandSplit = query.split(' ')
  const cmd = commandSplit[0]

  if (type === ProfileQueryType.Explain) {
    return [`ft.${type.toLowerCase()}`, ...commandSplit.slice(1)].join(' ')
  } else {
    let index = commandSplit[1]

    const queryType = cmd.split('.')[1] // SEARCH / AGGREGATE
    return [`ft.${type.toLowerCase()}`, index, queryType, 'QUERY', ...commandSplit.slice(2)].join(' ')
  }
}

export function generateProfileQueryForCommand(query: string, type: ProfileQueryType) {
  const cmd = query.split(' ')[0].toLowerCase()

  if (GRAPH_COMMANDS.includes(cmd)) {
    return generateGraphProfileQuery(query, type)
  } else if (SEARCH_COMMANDS.includes(cmd)) {
    return generateSearchProfileQuery(query, type)
  }

  return null
}
