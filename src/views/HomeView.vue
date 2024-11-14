<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'

import { db } from '../lib/db'

const content = ref(
  localStorage.getItem('unolist.topNote') === null // To have the ability to keep empty top note
    ? '[change me]'
    : (localStorage.getItem('unolist.topNote') as string),
)
const stackSize = ref(0)

const noteElement = useTemplateRef<HTMLInputElement>('noteDiv')

function addNote() {
  const trimmedValue = content.value.trim()
  noteElement.value?.focus()

  if (!trimmedValue) {
    alert("can't have empty note")
    return
  }

  db.notes.add({ content: trimmedValue })
  clearCurrentNote()
  stackSize.value++
  noteElement.value?.focus()
}

async function popNote() {
  const note = await db.notes.toCollection().last()

  if (!note) {
    clearCurrentNote()
    return
  }

  content.value = note.content
  ;(noteElement.value as HTMLElement).innerText = note.content
  db.notes.delete(note.id)
  stackSize.value--
}

function clearCurrentNote() {
  content.value = ''
  ;(noteElement.value as HTMLElement).innerText = ''
}

function onInput(event: Event) {
  content.value = (event.target as HTMLElement).innerText || ''
}

onMounted(async () => {
  stackSize.value = await db.notes.toCollection().count()
  ;(noteElement.value as HTMLElement).innerText = content.value
})

watch(content, () => {
  localStorage.setItem('unolist.topNote', content.value)
})
</script>

<template>
  <main>
    <button @click="addNote" class="btn">One more!</button>
    <div
      class="note"
      :class="{ stack: stackSize > 0 }"
      contenteditable="true"
      @input="onInput"
      ref="noteDiv"
    ></div>
    <button @click="popNote" class="btn">Done!</button>
  </main>
</template>

<style scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 32px;
  max-width: 768px;
  margin: auto;
}
.note {
  width: 300px;
  min-height: 100px;
  padding: 25px;
  position: relative;
  text-align: center;
  white-space: pre-wrap;
  font:
    normal normal normal 30px/34px 'Reenie Beanie',
    Helvetica,
    Arial,
    sans-serif;
  color: #000;
  background: -moz-linear-gradient(
    -45deg,
    #ffff88 81%,
    #ffff88 82%,
    #ffff88 82%,
    #ffffc6 100%
  ); /* FF3.6+ */
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    color-stop(81%, #ffff88),
    color-stop(82%, #ffff88),
    color-stop(82%, #ffff88),
    color-stop(100%, #ffffc6)
  ); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(
    -45deg,
    #ffff88 81%,
    #ffff88 82%,
    #ffff88 82%,
    #ffffc6 100%
  ); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(
    -45deg,
    #ffff88 81%,
    #ffff88 82%,
    #ffff88 82%,
    #ffffc6 100%
  ); /* Opera 11.10+ */
  background: -ms-linear-gradient(
    -45deg,
    #ffff88 81%,
    #ffff88 82%,
    #ffff88 82%,
    #ffffc6 100%
  ); /* IE10+ */
  background: linear-gradient(
    135deg,
    #ffff88 81%,
    #ffff88 82%,
    #ffff88 82%,
    #ffffc6 100%
  ); /* W3C */
  border: 1px solid #e8e8e8;
  border-top: 30px solid #fdfd86;
}

.note:after {
  content: '';
  position: absolute;
  z-index: -1;
  right: -0px;
  bottom: 20px;
  width: 200px;
  height: 25px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 2px 15px 5px rgba(0, 0, 0, 0.4);
  -moz-transform: matrix(-1, -0.1, 0, 1, 0, 0);
  -webkit-transform: matrix(-1, -0.1, 0, 1, 0, 0);
  -o-transform: matrix(-1, -0.1, 0, 1, 0, 0);
  -ms-transform: matrix(-1, -0.1, 0, 1, 0, 0);
  transform: matrix(-1, -0.1, 0, 1, 0, 0);
}

.stack {
  position: relative;
}

.stack:before,
.stack:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: inherit;
  border: inherit;
  top: 0;
  left: 0;
}

.stack:before {
  transform: rotate(-2deg);
  top: -5px;
  left: 5px;
  z-index: -2;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
}

.stack:after {
  transform: rotate(2deg);
  top: 5px;
  left: -5px;
  z-index: -1;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
}

.btn {
  background-color: black;
  border: none;
  color: white;
  padding: 8px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: white;
  color: black;
}
</style>
