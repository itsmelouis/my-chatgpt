import { isToday, isYesterday, subMonths, format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Chat {
  id: string
  label: string
  icon: string
  createdAt: string
}

export function useChats(chats: Ref<Chat[] | undefined>) {
  const groups = computed(() => {
    // Group chats by date
    const today: Chat[] = []
    const yesterday: Chat[] = []
    const lastWeek: Chat[] = []
    const lastMonth: Chat[] = []
    const older: Record<string, Chat[]> = {}

    const oneWeekAgo = subMonths(new Date(), 0.25) // ~7 days ago
    const oneMonthAgo = subMonths(new Date(), 1)

    chats.value?.forEach((chat) => {
      const chatDate = new Date(chat.createdAt)

      if (isToday(chatDate)) {
        today.push(chat)
      } else if (isYesterday(chatDate)) {
        yesterday.push(chat)
      } else if (chatDate >= oneWeekAgo) {
        lastWeek.push(chat)
      } else if (chatDate >= oneMonthAgo) {
        lastMonth.push(chat)
      } else {
        // Format avec date-fns et locale française: "janvier 2023", "février 2023", etc.
        const monthYear = format(chatDate, 'MMMM yyyy', { locale: fr })

        if (!older[monthYear]) {
          older[monthYear] = []
        }

        older[monthYear].push(chat)
      }
    })

    // Sort older chats by month-year in descending order (newest first)
    const sortedMonthYears = Object.keys(older).sort((a, b) => {
      const dateA = new Date(a)
      const dateB = new Date(b)
      return dateB.getTime() - dateA.getTime()
    })

    // Create formatted groups for navigation
    const formattedGroups = [] as Array<{
      id: string
      label: string
      items: Array<Chat>
    }>

    // Add groups that have chats
    if (today.length) {
      formattedGroups.push({
        id: 'today',
        label: 'Aujourd\'hui',
        items: today
      })
    }

    if (yesterday.length) {
      formattedGroups.push({
        id: 'yesterday',
        label: 'Hier',
        items: yesterday
      })
    }

    if (lastWeek.length) {
      formattedGroups.push({
        id: 'last-week',
        label: 'Semaine dernière',
        items: lastWeek
      })
    }

    if (lastMonth.length) {
      formattedGroups.push({
        id: 'last-month',
        label: 'Mois dernier',
        items: lastMonth
      })
    }

    // Add each month-year group
    sortedMonthYears.forEach((monthYear) => {
      if (older[monthYear]?.length) {
        formattedGroups.push({
          id: monthYear,
          label: monthYear,
          items: older[monthYear]
        })
      }
    })

    return formattedGroups
  })

  return {
    groups
  }
}
