<template>
  <div class="recent-activity bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Recent Activity</h2>
      <a-button type="link">View All</a-button>
    </div>
    <div class="activity-list">
      <div v-for="(activity, index) in activities" :key="index" class="activity-item py-3 border-b border-gray-100 last:border-0">
        <div class="flex">
          <div class="activity-icon mr-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="activity.iconBg">
              <component :is="activity.icon" class="text-white text-sm" />
            </div>
          </div>
          <div class="activity-content flex-1">
            <p class="text-sm">
              <span class="font-medium">{{ activity.user }}</span>
              {{ activity.action }}
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  FormOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  UserAddOutlined,
  CommentOutlined
} from '@ant-design/icons-vue';

const activities = [
  {
    user: 'John Doe',
    action: 'created a new requisition #REQ-2023-05',
    time: '2 hours ago',
    icon: FormOutlined,
    iconBg: 'bg-blue-500'
  },
  {
    user: 'Jane Smith',
    action: 'approved requisition #REQ-2023-04',
    time: '3 hours ago',
    icon: CheckCircleOutlined,
    iconBg: 'bg-green-500'
  },
  {
    user: 'Mike Johnson',
    action: 'rejected requisition #REQ-2023-03',
    time: '5 hours ago',
    icon: CloseCircleOutlined,
    iconBg: 'bg-red-500'
  },
  {
    user: 'Sarah Williams',
    action: 'added a new user to the system',
    time: '1 day ago',
    icon: UserAddOutlined,
    iconBg: 'bg-purple-500'
  },
  {
    user: 'David Brown',
    action: 'commented on requisition #REQ-2023-02',
    time: '1 day ago',
    icon: CommentOutlined,
    iconBg: 'bg-yellow-500'
  }
]
</script>
