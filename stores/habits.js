import { defineStore } from 'pinia'
import { addDoc, collection, doc, updateDoc , deleteDoc } from 'firebase/firestore'
import { getDocs } from 'firebase/firestore'

import { format , differenceInDays } from 'date-fns'

export const useHabitStore = defineStore('habitStore', {
  state : () => ({
    habits: [],
  }),

  actions: {
    //fetching all habbits

    async fetchHabits() {
      const { $db } = useNuxtApp();
      const querySnapshot = await getDocs(collection($db, 'habits'))
      this.habits = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    },



    //adding new habits 
    async addHabit(name) {
      const { $db } = useNuxtApp();
      const habit =  {
        name,
        completions: [],
        streak: 0,
      }

      const docRef = await addDoc(collection($db, 'habits'), habit)

      //add docRef id to the habit object and pust to habits
      this.habits.push({ id: docRef.id ,...habit})

    },


    //updating habits
    async updateHabit(id, updates) {
      const { $db } = useNuxtApp()
      // update in firebase
      const habitRef = doc($db, 'habits', id)
      await updateDoc(habitRef, updates)
      // update pinia store
      const index = this.habits.findIndex((habit) => habit.id === id)
      if (index !== -1) {
        this.habits[index] = { ...this.habits[index], ...updates }
      }
    },

    //deleting habits
    async deleteHabit(id) {
      const { $db } = useNuxtApp();
      const docRef = doc($db, 'habits', id)
      await deleteDoc(docRef)
      this.habits = this.habits.filter(habit => habit.id !== id)
    },


    //completing a daily habit
    toggleCompletion(habit) {
      const today = format(new Date(), 'yyyy-MM-dd')

      if (habit.completions.includes(today)) {
        habit.completions = habit.completions.filter(date => date !== today)
      } else {
        habit.completions.push(today)
      }
      // update streak and completions
      habit.streak = this.calculateStreak(habit.completions)
      this.updateHabit(habit.id, {
        completions: habit.completions,
        streak: habit.streak,
      })
    },


    //calculating streaks
    calculateStreak(completions) {
      const sortedDates = completions.sort((a, b) => new Date(b) - new Date(a))
      let streak = 0
      let currentDate = new Date()

      for (const date of sortedDates) {
        const diff = differenceInDays(currentDate, new Date(date))

        if (diff > 1) {
          break
        }
        
        streak += 1
        currentDate = new Date(date)
      }
      
      return streak
      
    }
  }
})