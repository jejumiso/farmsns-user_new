<!-- pages/[companyId]/index.vue -->
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

router.replace(`/${route.params.companyId}/products`)
</script>
