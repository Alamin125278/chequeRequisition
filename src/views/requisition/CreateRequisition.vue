<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-1">
    <!-- <div class="max-w-4xl mx-auto"> -->
      <!-- Header with Logo and Title -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center">
          <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3 rounded-xl mr-4 shadow-md">
            <bank-outlined class="text-2xl" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-800">
              Create Cheque Request
            </h1>
            <p class="text-sm text-slate-500 mt-1">Fill the form below to create a new cheque request</p>
          </div>
        </div>
        <div class="text-sm bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100 text-slate-600 flex items-center">
          <calendar-outlined class="mr-2 text-emerald-500" />
          {{ new Date().toLocaleDateString() }}
        </div>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
        <!-- Card Header -->
        <div class="bg-gradient-to-r from-slate-50 to-white px-8 py-5 border-b border-slate-200">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center">
            <file-text-outlined class="mr-3 text-emerald-600" />
            Cheque Request Details
          </h2>
        </div>

        <!-- Form Content -->
        <div class="p-8">
          <a-form
            :model="formState"
            layout="vertical"
            @finish="handleSubmit"
            class="space-y-8"
          >
            <!-- First Section: Basic Information -->
            <div>
              <h3 class="text-md font-medium text-slate-700 mb-4 flex items-center">
                <user-outlined class="mr-2 text-emerald-500" /> Basic Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Requested By -->
                <a-form-item
                  label="Requested By"
                  name="requestedBy"
                  :rules="[{ required: true, message: 'Please select requester' }]"
                >
                  <a-select
                    v-model:value="formState.requestedBy"
                    placeholder="Select requester"
                    :disabled="true"
                    class="w-full"
                  >
                    <a-select-option value="John Doe">John Doe</a-select-option>
                  </a-select>
                </a-form-item>

                <!-- Bank Name -->
                <a-form-item
                  label="Bank Name"
                  name="bankName"
                  :rules="[{ required: true, message: 'Bank name is required' }]"
                >
                  <a-select
                    v-model:value="formState.bankName"
                    placeholder="Select bank"
                    :disabled="true"
                    class="w-full"
                  >
                    <a-select-option value="National Bank">National Bank</a-select-option>
                  </a-select>
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <!-- Request Branch Name -->
                <a-form-item
                  label="Request Branch Name"
                  name="requestBranchName"
                  :rules="[{ required: true, message: 'Request branch is required' }]"
                >
                  <a-select
                    v-model:value="formState.requestBranchName"
                    placeholder="Select branch"
                    :disabled="true"
                    class="w-full"
                  >
                    <a-select-option value="Main Branch">Main Branch</a-select-option>
                    <a-select-option value="Downtown Branch">Downtown Branch</a-select-option>
                  </a-select>
                </a-form-item>

                <!-- Receiving Branch Name -->
                <a-form-item
                  label="Receiving Branch Name"
                  name="receivingBranchName"
                  :rules="[{ required: true, message: 'Receiving branch is required' }]"
                >
                  <a-select
                    v-model:value="formState.receivingBranchName"
                    placeholder="Select receiving branch"
                    class="w-full"
                  >
                    <a-select-option value="Main Branch">Main Branch</a-select-option>
                    <a-select-option value="Downtown Branch">Downtown Branch</a-select-option>
                    <a-select-option value="Uptown Branch">Uptown Branch</a-select-option>
                    <a-select-option value="West Branch">West Branch</a-select-option>
                    <a-select-option value="East Branch">East Branch</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>

            <div class="border-t border-slate-100 pt-6"></div>

            <!-- Second Section: Account Information -->
            <div>
              <h3 class="text-md font-medium text-slate-700 mb-4 flex items-center">
                <credit-card-outlined class="mr-2 text-emerald-500" /> Account Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Request Date -->
                <a-form-item
                  label="Request Date"
                  name="requestDate"
                  :rules="[{ required: true, message: 'Request date is required' }]"
                >
                  <a-date-picker
                    v-model:value="formState.requestDate"
                    class="w-full"
                    format="YYYY-MM-DD"
                  />
                </a-form-item>

                <!-- Account Number -->
                <a-form-item
                  label="Account Number"
                  name="accountNumber"
                  :rules="[{ required: true, message: 'Account number is required' }]"
                >
                  <a-auto-complete
                    v-model:value="formState.accountNumber"
                    placeholder="Enter account number"
                    :options="filteredAccounts"
                    @select="handleAccountSelect"
                    @search="handleAccountSearch"
                    class="w-full"
                  >
                    <template #option="{ value: accountNumber, label }">
                      <div class="py-1.5 px-1">
                        <div class="font-medium text-slate-800">{{ accountNumber }}</div>
                        <div class="text-xs text-slate-500 mt-0.5">{{ label }}</div>
                      </div>
                    </template>
                  </a-auto-complete>
                </a-form-item>
              </div>

              <!-- Auto-populated fields -->
              <div class="mt-4 bg-gradient-to-r from-slate-50 to-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 class="text-sm font-medium text-slate-700 mb-3 flex items-center">
                  <info-circle-outlined class="mr-2 text-emerald-500" />
                  Account Details <span class="text-xs text-slate-500 ml-2">(Auto-populated)</span>
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Customer Name -->
                  <a-form-item label="Customer Name" name="customerName">
                    <a-input
                      v-model:value="formState.customerName"
                      placeholder="Customer name"
                      :disabled="true"
                    >
                      <template #prefix>
                        <user-outlined class="text-slate-400" />
                      </template>
                    </a-input>
                  </a-form-item>

                  <!-- Routing Number -->
                  <a-form-item label="Routing Number" name="routingNumber">
                    <a-input
                      v-model:value="formState.routingNumber"
                      placeholder="Routing number"
                      :disabled="true"
                    >
                      <template #prefix>
                        <number-outlined class="text-slate-400" />
                      </template>
                    </a-input>
                  </a-form-item>

                  <!-- Account Type -->
                  <a-form-item label="Account Type" name="accountType">
                    <a-input
                      v-model:value="formState.accountType"
                      placeholder="Account type"
                      :disabled="true"
                    >
                      <template #prefix>
                        <wallet-outlined class="text-slate-400" />
                      </template>
                    </a-input>
                  </a-form-item>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-100 pt-6"></div>

            <!-- Third Section: Cheque Details -->
            <div>
              <h3 class="text-md font-medium text-slate-700 mb-4 flex items-center">
                <book-outlined class="mr-2 text-emerald-500" /> Cheque Details
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Cheque Leaves Option -->
                <a-form-item
                  label="Cheque Leaves Option"
                  name="chequeLeaves"
                  :rules="[{ required: true, message: 'Please select cheque leaves option' }]"
                >
                  <a-select
                    v-model:value="formState.chequeLeaves"
                    placeholder="Select cheque leaves"
                    class="w-full"
                  >
                    <template v-if="formState.accountType === 'Savings'">
                      <a-select-option value="10">10 Leaves</a-select-option>
                      <a-select-option value="25">25 Leaves</a-select-option>
                      <a-select-option value="50">50 Leaves</a-select-option>
                    </template>
                    <template v-else-if="formState.accountType === 'Current'">
                      <a-select-option value="10">10 Leaves</a-select-option>
                      <a-select-option value="25">25 Leaves</a-select-option>
                      <a-select-option value="50">50 Leaves</a-select-option>
                      <a-select-option value="100">100 Leaves</a-select-option>
                    </template>
                  </a-select>
                </a-form-item>

                <!-- Book Quantity -->
                <a-form-item
                  label="Book Quantity"
                  name="bookQuantity"
                  :rules="[{ required: true, message: 'Book quantity is required' }]"
                >
                  <a-input-number
                    v-model:value="formState.bookQuantity"
                    :min="1"
                    :max="10"
                    class="w-full"
                  />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <!-- First Leaf Number -->
                <a-form-item
                  label="First Leaf Number"
                  name="firstLeafNumber"
                  :rules="[{ required: true, message: 'First leaf number is required' }]"
                >
                  <a-input
                    v-model:value="formState.firstLeafNumber"
                    placeholder="Enter first leaf number"
                  />
                </a-form-item>

                <!-- Series -->
                <a-form-item
                  label="Series"
                  name="series"
                  :rules="[{ required: true, message: 'Please select series' }]"
                >
                  <a-radio-group v-model:value="formState.series" class="flex space-x-6">
                    <a-radio value="A">
                      <span class="font-medium">Series A</span>
                    </a-radio>
                    <a-radio value="B">
                      <span class="font-medium">Series B</span>
                    </a-radio>
                    <a-radio value="C">
                      <span class="font-medium">Series C</span>
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
            </div>

            <div class="border-t border-slate-100 pt-6"></div>

            <!-- Fourth Section: Delivery Details -->
            <div>
              <h3 class="text-md font-medium text-slate-700 mb-4 flex items-center">
                <car-outlined class="mr-2 text-emerald-500" /> Delivery Details
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Courier Name -->
                <a-form-item
                  label="Courier Name"
                  name="courierName"
                  :rules="[{ required: true, message: 'Please select courier' }]"
                >
                  <a-select
                    v-model:value="formState.courierName"
                    placeholder="Select courier"
                    class="w-full"
                  >
                    <a-select-option value="DHL">DHL</a-select-option>
                    <a-select-option value="FedEx">FedEx</a-select-option>
                    <a-select-option value="UPS">UPS</a-select-option>
                    <a-select-option value="Local Courier">Local Courier</a-select-option>
                  </a-select>
                </a-form-item>

                <!-- Severity -->
                <a-form-item
                  label="Severity"
                  name="severity"
                  :rules="[{ required: true, message: 'Please select severity' }]"
                >
                  <a-radio-group v-model:value="formState.severity" class="flex space-x-6">
                    <a-radio value="Urgent">
                      <span class="text-red-600 font-medium flex items-center">
                        <thunderbolt-outlined class="mr-1" /> Urgent
                      </span>
                    </a-radio>
                    <a-radio value="Normal">
                      <span class="text-slate-600 font-medium">Normal</span>
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>

              <!-- Remarks -->
              <a-form-item
                label="Remarks"
                name="remarks"
                class="mt-4"
              >
                <a-textarea
                  v-model:value="formState.remarks"
                  placeholder="Enter additional notes or remarks"
                  :rows="4"
                  class="rounded-lg"
                />
              </a-form-item>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-slate-100">
              <a-button
                @click="resetForm"
                size="large"
                class="rounded-lg px-6 border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 flex items-center"
              >
                <reload-outlined class="mr-2" /> Reset
              </a-button>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                class="rounded-lg px-8 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 flex items-center shadow-md"
              >
                <check-outlined class="mr-2" /> Preview & Submit
              </a-button>
            </div>
          </a-form>
        </div>
      </div>

      <!-- Help Card -->
      <div class="mt-8 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div class="flex items-start">
          <div class="bg-slate-50 p-3 rounded-lg mr-4 border border-slate-200">
            <info-circle-outlined class="text-emerald-600 text-lg" />
          </div>
          <div>
            <h3 class="font-medium text-slate-800 mb-1">Need Help?</h3>
            <p class="text-sm text-slate-600">
              If you're having trouble with the cheque request form, please contact
              support at
              <a
                href="mailto:support@example.com"
                class="text-emerald-600 hover:text-emerald-700 font-medium"
              >support@example.com</a>
            </p>
          </div>
        </div>
      </div>
    <!-- </div> -->

    <!-- Preview Modal -->
    <a-modal
      v-model:visible="previewModalVisible"
      :footer="null"
      title="Review Cheque Request"
      width="700px"
      class="preview-modal"
      :maskClosable="false"
    >
      <div class="space-y-6 py-2">
        <div class="bg-gradient-to-r from-slate-50 to-white p-5 rounded-xl border border-slate-200">
          <h3 class="font-medium text-slate-800 mb-3 flex items-center">
            <user-outlined class="mr-2 text-emerald-500" /> Request Information
          </h3>
          <div class="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p class="text-sm text-slate-500">Requested By</p>
              <p class="font-medium text-slate-800">{{ formState.requestedBy }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Bank Name</p>
              <p class="font-medium text-slate-800">{{ formState.bankName }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Request Branch</p>
              <p class="font-medium text-slate-800">{{ formState.requestBranchName }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Receiving Branch</p>
              <p class="font-medium text-slate-800">{{ formState.receivingBranchName }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Request Date</p>
              <p class="font-medium text-slate-800">{{ formState.requestDate?.format('YYYY-MM-DD') }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Severity</p>
              <p class="font-medium flex items-center" :class="{ 'text-red-600': formState.severity === 'Urgent' }">
                <thunderbolt-outlined v-if="formState.severity === 'Urgent'" class="mr-1" />
                {{ formState.severity }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-slate-50 to-white p-5 rounded-xl border border-slate-200">
          <h3 class="font-medium text-slate-800 mb-3 flex items-center">
            <credit-card-outlined class="mr-2 text-emerald-500" /> Account Information
          </h3>
          <div class="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p class="text-sm text-slate-500">Account Number</p>
              <p class="font-medium text-slate-800">{{ formState.accountNumber }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Customer Name</p>
              <p class="font-medium text-slate-800">{{ formState.customerName }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Routing Number</p>
              <p class="font-medium text-slate-800">{{ formState.routingNumber }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Account Type</p>
              <p class="font-medium text-slate-800">{{ formState.accountType }}</p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-slate-50 to-white p-5 rounded-xl border border-slate-200">
          <h3 class="font-medium text-slate-800 mb-3 flex items-center">
            <book-outlined class="mr-2 text-emerald-500" /> Cheque Details
          </h3>
          <div class="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p class="text-sm text-slate-500">Cheque Leaves</p>
              <p class="font-medium text-slate-800">{{ formState.chequeLeaves }} leaves</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Book Quantity</p>
              <p class="font-medium text-slate-800">{{ formState.bookQuantity }} books</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">First Leaf Number</p>
              <p class="font-medium text-slate-800">{{ formState.firstLeafNumber }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Series</p>
              <p class="font-medium text-slate-800">Series {{ formState.series }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Courier</p>
              <p class="font-medium text-slate-800">{{ formState.courierName }}</p>
            </div>
          </div>
        </div>

        <div v-if="formState.remarks" class="bg-gradient-to-r from-slate-50 to-white p-5 rounded-xl border border-slate-200">
          <h3 class="font-medium text-slate-800 mb-2 flex items-center">
            <message-outlined class="mr-2 text-emerald-500" /> Remarks
          </h3>
          <p class="text-slate-700">{{ formState.remarks }}</p>
        </div>

        <!-- Modal Footer Actions -->
        <div class="flex justify-end space-x-4 pt-6 mt-4 border-t border-slate-200">
          <a-button
            @click="previewModalVisible = false"
            size="large"
            class="rounded-lg px-6 border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400"
          >
            Cancel
          </a-button>
          <a-button
            type="primary"
            @click="submitForm"
            :loading="isSubmitting"
            size="large"
            class="rounded-lg px-8 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 flex items-center shadow-md"
          >
            <check-circle-outlined v-if="!isSubmitting" class="mr-2" /> 
            {{ isSubmitting ? 'Submitting...' : 'Confirm & Submit' }}
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- Success Modal -->
    <a-modal
      v-model:visible="successModalVisible"
      :footer="null"
      :closable="false"
      width="450px"
      class="custom-modal"
    >
      <div class="text-center py-8 px-4">
        <div class="mx-auto mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-100">
          <check-outlined class="text-emerald-500 text-4xl" />
        </div>
        <h3 class="text-2xl font-bold text-slate-800 mb-3">
          Request Submitted!
        </h3>
        <p class="text-slate-600 mb-8 max-w-sm mx-auto">
          Your cheque request has been successfully submitted and is being processed. You will receive a confirmation email shortly.
        </p>
        <a-button
          type="primary"
          @click="successModalVisible = false"
          size="large"
          class="w-full rounded-lg py-3 h-auto bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-base font-medium shadow-md"
        >
          Continue
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import {
  BankOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  CalendarOutlined,
  UserOutlined,
  CreditCardOutlined,
  BookOutlined,
  WalletOutlined,
  NumberOutlined,
  CarOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue';

// Form state
const formState = reactive({
  requestedBy: 'John Doe',
  bankName: 'National Bank',
  requestBranchName: 'Main Branch',
  receivingBranchName: '',
  requestDate: dayjs(),
  accountNumber: '',
  customerName: '',
  routingNumber: '',
  accountType: '',
  chequeLeaves: '',
  bookQuantity: 1,
  firstLeafNumber: '',
  severity: 'Normal',
  courierName: '',
  series: 'A',
  remarks: '',
});

// Mock database for account lookup
const accountDatabase = [
  {
    accountNumber: '1234567890',
    customerName: 'John Smith',
    routingNumber: 'RT-123456',
    accountType: 'Savings',
  },
  {
    accountNumber: '0987654321',
    customerName: 'Jane Doe',
    routingNumber: 'RT-654321',
    accountType: 'Current',
  },
  {
    accountNumber: '5678901234',
    customerName: 'Robert Johnson',
    routingNumber: 'RT-567890',
    accountType: 'Savings',
  },
  {
    accountNumber: '2468013579',
    customerName: 'Emily Williams',
    routingNumber: 'RT-246801',
    accountType: 'Current',
  },
  {
    accountNumber: '1357924680',
    customerName: 'Michael Brown',
    routingNumber: 'RT-135792',
    accountType: 'Savings',
  },
];

// Account search and filtering
const searchValue = ref('');
const filteredAccounts = ref([]);

// Handle account search for autocomplete
const handleAccountSearch = (value: string) => {
  searchValue.value = value;
  if (value) {
    filteredAccounts.value = accountDatabase
      .filter(account => 
        account.accountNumber.toLowerCase().includes(value.toLowerCase())
      )
      .map(account => ({
        value: account.accountNumber,
        label: `${account.customerName} (${account.accountType})`
      }));
  } else {
    filteredAccounts.value = [];
  }
};

// Handle account selection from dropdown
const handleAccountSelect = (value: string) => {
  const account = accountDatabase.find(acc => acc.accountNumber === value);
  if (account) {
    formState.accountNumber = account.accountNumber;
    formState.customerName = account.customerName;
    formState.routingNumber = account.routingNumber;
    formState.accountType = account.accountType;
    
    // Reset cheque leaves when account type changes
    formState.chequeLeaves = '';
    
    message.success('Account information loaded successfully');
  }
};

// Modal visibility states
const previewModalVisible = ref(false);
const successModalVisible = ref(false);
const isSubmitting = ref(false);

// Handle form submission
const handleSubmit = () => {
  // Show preview modal before actual submission
  previewModalVisible.value = true;
};

// Submit form after preview confirmation
const submitForm = () => {
  isSubmitting.value = true;
  
  // Simulate API call
  setTimeout(() => {
    isSubmitting.value = false;
    previewModalVisible.value = false;
    successModalVisible.value = true;
  }, 1500);
};

// Reset form
const resetForm = () => {
  // Keep the read-only fields
  const readOnlyFields = {
    requestedBy: formState.requestedBy,
    bankName: formState.bankName,
    requestBranchName: formState.requestBranchName,
  };
  
  // Reset all fields
  Object.assign(formState, {
    ...readOnlyFields,
    receivingBranchName: '',
    requestDate: dayjs(),
    accountNumber: '',
    customerName: '',
    routingNumber: '',
    accountType: '',
    chequeLeaves: '',
    bookQuantity: 1,
    firstLeafNumber: '',
    severity: 'Normal',
    courierName: '',
    series: 'A',
    remarks: '',
  });
  
  message.success('Form has been reset');
};
</script>

<style scoped>
/* Custom styles for Ant Design components */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-picker),
:deep(.ant-select-selector),
:deep(.ant-input-affix-wrapper) {
  border-radius: 0.5rem !important;
  transition: all 0.3s;
  border-color: #e2e8f0;
}

:deep(.ant-input-affix-wrapper .ant-input) {
  border-radius: 0 !important;
}

:deep(.ant-btn) {
  border-radius: 0.5rem;
  transition: all 0.3s;
}

:deep(.ant-btn-primary) {
  background-color: #10b981;
  border-color: #10b981;
}

:deep(.ant-btn-primary:hover) {
  background-color: #059669;
  border-color: #059669;
}

:deep(.ant-input:focus),
:deep(.ant-input-number-focused),
:deep(.ant-picker-focused),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-input-affix-wrapper-focused) {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
}

:deep(.ant-input:hover),
:deep(.ant-input-number:hover),
:deep(.ant-picker:hover),
:deep(.ant-select:hover .ant-select-selector),
:deep(.ant-input-affix-wrapper:hover) {
  border-color: #10b981 !important;
}

:deep(.ant-radio-wrapper .ant-radio-checked .ant-radio-inner) {
  background-color: #10b981;
  border-color: #10b981;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #475569;
}

:deep(.ant-modal-content) {
  border-radius: 0.75rem;
  overflow: hidden;
}

:deep(.ant-modal-header) {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
}

:deep(.ant-modal-title) {
  font-weight: 600;
  color: #1e293b;
  font-size: 1.125rem;
}

:deep(.ant-modal-close) {
  color: #64748b;
}

:deep(.ant-modal-body) {
  padding: 24px;
}

:deep(.ant-select-item) {
  padding: 8px 12px;
}

:deep(.ant-select-item-option-active:not(.ant-select-item-option-disabled)) {
  background-color: #f0fdfa;
}

:deep(.ant-select-item-option-selected:not(.ant-select-item-option-disabled)) {
  background-color: #d1fae5;
  font-weight: 500;
}

/* Custom animation for success modal */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-modal :deep(.ant-modal-content) {
  animation: fadeInUp 0.3s ease-out;
}

.preview-modal :deep(.ant-modal-content) {
  animation: fadeInUp 0.3s ease-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(.ant-form-item) {
    margin-bottom: 12px;
  }
}
</style>