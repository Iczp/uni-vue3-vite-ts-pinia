<script setup>
import VuePdfEmbed from "vue-pdf-embed";

// optional styles
import "vue-pdf-embed/dist/styles/annotationLayer.css";
import "vue-pdf-embed/dist/styles/textLayer.css";

// either URL, Base64, binary, or document proxy
const pdfSource = "/static/pdf/0.pdf";
</script>

<template>
 Pdf: {{ pdfSource }}
  <VuePdfEmbed annotation-layer text-layer :source="pdfSource" />
</template>
