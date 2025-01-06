import { defineStore } from 'pinia'
import { addDoc, collection, doc, updateDoc , deleteDoc } from 'firebase/firestore'
import { getDocs } from 'firebase/firestore'

import { format } from 'date-fns'

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

      this.updateHabit(habit.id, {
        completions: habit.completions,
      })
    },


    //calculating streaks
  }
})