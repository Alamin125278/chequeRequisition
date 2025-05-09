<template>
    <div class="new-requisition-page">
      <div class="page-header mb-6">
        <h1 class="text-2xl font-semibold">New Branch</h1>
        <p class="text-gray-500">Create a new branch</p>
      </div>
  
      <div class="bg-white rounded-lg shadow-md p-6">
        <a-form
          :model="formState"
          name="requisitionForm"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          @finish="onFinish"
        >
          <!-- Basic Information -->
          <div class="form-section mb-6">
            <a-form-item
              label="Branch Name"
              name="branchName"
              :rules="[{ required: true, message: 'Please input branch name!' }]"
            >
              <a-input v-model:value="formState.branchName" placeholder="Enter a branch name" />
            </a-form-item>
  
            <a-form-item
              label="Branch Code"
              name="branchCode"
              :rules="[{ required: true, message: 'Please input branch code!' }]"
            >
              <a-input 
                v-model:value="formState.branchCode" 
                placeholder="Enter branch code"
              />
            </a-form-item>
            <a-form-item label="Branch Email" name="branchEmail" :rules="[{ required: true, message: 'Please input branch Email!' }]">
                <a-input v-model:value="formState.branchEmail" placeholder="Enter branch Email" />
            </a-form-item>
  
            <a-form-item
              label="Routing Number"
              name="routingNumber"
              :rules="[{ required: true, message: 'Please input routing number!' }]"
            >
              <a-input v-model:value="formState.routingNumber" placeholder="Enter routing number" />
        </a-form-item>
            <a-form-item label="Branch Phone" name="branchPhone" :rules="[{ required: true, message: 'Please input branch Phone!' }]">
                <a-input v-model:value="formState.branchPhone" placeholder="Enter branch Phone" />
            </a-form-item>
            <a-form-item label="Branch Address" name="branchAddress" :rules="[{ required: true, message: 'Please input branch Address!' }]">
                <a-input v-model:value="formState.branchAddress" placeholder="Enter branch Address" />
            </a-form-item>
              <!-- <a-select v-model:value="formState.department" placeholder="Select department">
                <a-select-option value="finance">Finance</a-select-option>
                <a-select-option value="hr">Human Resources</a-select-option>
                <a-select-option value="it">IT</a-select-option>
                <a-select-option value="marketing">Marketing</a-select-option>
                <a-select-option value="operations">Operations</a-select-option>
              </a-select>
            </a-form-item> -->
  
            <!-- <a-form-item
              label="Priority"
              name="priority"
            >
              <a-radio-group v-model:value="formState.priority">
                <a-radio value="low">Low</a-radio>
                <a-radio value="medium">Medium</a-radio>
                <a-radio value="high">High</a-radio>
              </a-radio-group>
            </a-form-item> -->
          </div>
  
          <!-- Form Actions -->
          <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
            <div class="flex space-x-2">
              <a-button @click="resetForm">Cancel</a-button>
              <a-button type="primary" html-type="submit">Create</a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import { UploadOutlined, FileOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { Upload } from 'ant-design-vue';
  
  interface FormState {
    branchName: string;
    branchCode: string;
    branchEmail: string;
    routingNumber: string;
    branchPhone: string;        
    branchAddress: string;
  }
  
  const formState = reactive<FormState>({
    branchName: '',
    branchCode: '',
    branchEmail: '',
    routingNumber: '',
    branchPhone: '',        
    branchAddress: '',
  });
  
  const onFinish = (values: any) => {
    console.log('Form submitted:', values);
    message.success('Requisition submitted successfully!');
    resetForm();
  };
  
  const resetForm = () => {
    formState.branchName = '';
    formState.branchCode = '';
    formState.branchEmail = '';
    formState.routingNumber = '';
    formState.branchPhone = '';        
    formState.branchAddress = '';
  };
  </script>
  
  <style scoped>
  .form-section {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 16px;
  }
  </style>
  