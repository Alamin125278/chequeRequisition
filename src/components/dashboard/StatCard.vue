<template>
  <div
    class="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white rounded-lg"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50" />
    <div class="relative p-6">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-600 mb-1">{{ title }}</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-bold text-gray-900">{{ value }}</h3>
            <span
              v-if="change !== undefined"
              :class="[
                'text-sm font-semibold flex items-center gap-1',
                getTrendColor(),
              ]"
            >
              <span class="text-xs">{{ getTrendIcon() }}</span>
              {{ Math.abs(change) }}%
            </span>
          </div>
          <p v-if="subtitle" class="text-xs text-gray-500 mt-1">
            {{ subtitle }}
          </p>
        </div>
        <div
          :class="[
            'flex items-center justify-center w-12 h-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300',
            iconBgColor,
          ]"
        >
          <component :is="icon" class="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  icon: any;
  iconBgColor?: string;
  change?: number;
  subtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  iconBgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
});

const getTrendColor = () => {
  if (props.change === undefined) return "";
  if (props.change > 0) return "text-emerald-600";
  if (props.change < 0) return "text-red-500";
  return "text-gray-500";
};

const getTrendIcon = () => {
  if (props.change === undefined) return "";
  return props.change >= 0 ? "↗" : "↘";
};
</script>
