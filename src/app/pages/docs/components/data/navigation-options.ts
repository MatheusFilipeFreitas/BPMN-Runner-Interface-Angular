export type NavigationLayer = {
  id: string,
  title: string,
  childs?: NavigationLayer[]
}

export const navigationLayers: NavigationLayer[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    childs: [
      { id: 'introduction >> what-is', title: 'What is BPMN Runner?' },
      { id: 'introduction >> essentials', title: 'Essentials' },
      { id: 'introduction >> start-coding', title: 'Start coding!' }
    ]
  },
  {
    id: 'in-depth',
    title: 'In-depth Guides',
    childs: [
      { id: 'in-depth >> tasks', title: 'Tasks' },
      { id: 'in-depth >> gateways', title: 'Gateways' },
      { id: 'in-depth >> events', title: 'Events' },
      { id: 'in-depth >> pools', title: 'Pools' },
      { id: 'in-depth >> processes', title: 'Processes' },
      { id: 'in-depth >> messages', title: 'Message Flow' }
    ]
  },
  {
    id: 'api',
    title: 'Api Integration',
    childs: [
      { id: 'api >> integration', title: 'Guide' }
    ]
  }
]
