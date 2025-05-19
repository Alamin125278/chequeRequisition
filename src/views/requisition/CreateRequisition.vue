<template>
  <div class="bg-background min-h-screen">
    <!-- Professional Hero Header Section -->
    <div class="bg-card border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-accent rounded-md p-2">
                <FileAddOutlined class="h-6 w-6 text-white" />
              </div>
              <h1 class="ml-3 text-2xl font-semibold text-primary">
                <span class="text-accent">Create</span> Cheque Requisition
              </h1>
            </div>
            <p class="mt-2 text-sm text-secondary max-w-2xl">
              Fill the form below to create a new cheque request for processing.
            </p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4">
            <a-tooltip title="Current Date">
              <div
                class="bg-card border border-gray-200 rounded-md px-4 py-2 flex items-center"
              >
                <CalendarOutlined class="mr-2 text-accent" />
                {{ currentDate }}
              </div>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Form Card -->
    <div class="max-w-7xl mx-auto py-6">
      <div class="bg-card shadow-md rounded-md overflow-hidden mb-6">
        <div class="px-6 py-4 bg-background border-b border-gray-200">
          <h2 class="text-lg font-medium text-primary flex items-center">
            <FormOutlined class="mr-2 text-accent" /> Cheque Request Details
          </h2>
        </div>

        <div class="p-6">
          <a-form :model="formState" layout="vertical" @finish="handleSubmit">
            <!-- First Section: Basic Information -->
            <div class="mb-8">
              <h3
                class="text-md font-medium text-primary mb-4 flex items-center border-b border-gray-100 pb-2"
              >
                <UserOutlined class="mr-2 text-accent" /> Basic Information
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Requested By -->
                <a-form-item
                  label="Requested By"
                  name="requestedBy"
                  :rules="[
                    { required: true, message: 'Please select requester' },
                  ]"
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
                  :rules="[
                    { required: true, message: 'Bank name is required' },
                  ]"
                >
                  <a-select
                    v-model:value="formState.bankName"
                    placeholder="Select bank"
                    :disabled="true"
                    class="w-full"
                  >
                    <a-select-option value="National Bank"
                      >National Bank</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <!-- Request Branch Name -->
                <a-form-item
                  label="Request Branch Name"
                  name="requestBranchName"
                  :rules="[
                    { required: true, message: 'Request branch is required' },
                  ]"
                >
                  <a-select
                    v-model:value="formState.requestBranchName"
                    placeholder="Select branch"
                    :disabled="true"
                    class="w-full"
                  >
                    <a-select-option value="Main Branch"
                      >Main Branch</a-select-option
                    >
                    <a-select-option value="North Branch"
                      >North Branch</a-select-option
                    >
                  </a-select>
                </a-form-item>

                <!-- Receiving Branch Name -->
                <a-form-item
                  label="Receiving Branch Name"
                  name="receivingBranchName"
                  :rules="[
                    { required: true, message: 'Receiving branch is required' },
                  ]"
                >
                  <a-select
                    v-model:value="formState.receivingBranchName"
                    placeholder="Select receiving branch"
                    class="w-full"
                  >
                    <a-select-option value=""
                      >Select Receiving Branch</a-select-option
                    >
                    <a-select-option value="Main Branch"
                      >Main Branch</a-select-option
                    >
                    <a-select-option value="North Branch"
                      >North Branch</a-select-option
                    >
                    <a-select-option value="South Branch"
                      >South Branch</a-select-option
                    >
                    <a-select-option value="East Branch"
                      >East Branch</a-select-option
                    >
                    <a-select-option value="West Branch"
                      >West Branch</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </div>
            </div>

            <!-- Second Section: Account Information -->
            <div class="mb-8">
              <h3
                class="text-md font-medium text-primary mb-4 flex items-center border-b border-gray-100 pb-2"
              >
                <CreditCardOutlined class="mr-2 text-accent" /> Account
                Information
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Request Date -->
                <a-form-item
                  label="Request Date"
                  name="requestDate"
                  :rules="[
                    { required: true, message: 'Request date is required' },
                  ]"
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
                  :rules="[
                    { required: true, message: 'Account number is required' },
                  ]"
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
                        <div class="font-medium text-primary">
                          {{ accountNumber }}
                        </div>
                        <div class="text-xs text-secondary mt-0.5">
                          {{ label }}
                        </div>
                      </div>
                    </template>
                  </a-auto-complete>
                </a-form-item>
              </div>

              <!-- Auto-populated fields -->
              <div
                class="mt-4 bg-background p-5 rounded-md border border-gray-200 shadow-sm"
              >
                <h4
                  class="text-sm font-medium text-primary mb-3 flex items-center"
                >
                  <InfoCircleOutlined class="mr-2 text-accent" />
                  Account Details
                  <span class="text-xs text-secondary ml-2"
                    >(Auto-populated)</span
                  >
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
                        <UserOutlined class="text-secondary" />
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
                        <NumberOutlined class="text-secondary" />
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
                        <WalletOutlined class="text-secondary" />
                      </template>
                    </a-input>
                  </a-form-item>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- MICR Number -->
                  <a-form-item label="MICR Number" name="micrNumber">
                    <a-input
                      v-model:value="formState.micrNumber"
                      placeholder="MICR number"
                      :disabled="true"
                    >
                      <template #prefix>
                        <NumberOutlined class="text-secondary" />
                      </template>
                    </a-input>
                  </a-form-item>

                  <!-- TR Code -->
                  <a-form-item label="TR Code" name="trCode">
                    <a-input
                      v-model:value="formState.trCode"
                      placeholder="TR code"
                      :disabled="true"
                    >
                      <template #prefix>
                        <NumberOutlined class="text-secondary" />
                      </template>
                    </a-input>
                  </a-form-item>

                  <!-- Cheque Prefix -->
                  <a-form-item label="Cheque Prefix" name="chequePrefix">
                    <a-input
                      v-model:value="formState.chequePrefix"
                      placeholder="Cheque prefix"
                      :disabled="true"
                    >
                      <template #prefix>
                        <NumberOutlined class="text-secondary" />
                      </template>
                    </a-input>
                  </a-form-item>
                </div>
                <div class="grid grid-cols-1">
                  <a-form-item label="Customer Address" name="customerAddress">
                    <a-textarea
                      v-model:value="formState.customerAddress"
                      placeholder="Enter customer address"
                      :rows="4"
                      class="rounded-md"
                      :disabled="true"
                    />
                  </a-form-item>
                </div>
              </div>
            </div>

            <!-- Third Section: Cheque Details -->
            <div class="mb-8">
              <h3
                class="text-md font-medium text-primary mb-4 flex items-center border-b border-gray-100 pb-2"
              >
                <BookOutlined class="mr-2 text-accent" /> Cheque Details
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Cheque Leaves Option -->
                <a-form-item
                  label="Cheque Leaves Option"
                  name="chequeLeaves"
                  :rules="[
                    {
                      required: true,
                      message: 'Please select cheque leaves option',
                    },
                  ]"
                >
                  <a-select
                    v-model:value="formState.chequeLeaves"
                    placeholder="Select cheque leaves"
                    class="w-full"
                    @change="handleSerialNumberChange"
                  >
                    <a-select-option value="">Select Leaves</a-select-option>
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
                    <template v-else>
                      <a-select-option value="10">10 Leaves</a-select-option>
                      <a-select-option value="25">25 Leaves</a-select-option>
                    </template>
                  </a-select>
                </a-form-item>

                <!-- Book Quantity -->
                <a-form-item
                  label="Book Quantity"
                  name="bookQuantity"
                  :rules="[
                    { required: true, message: 'Book quantity is required' },
                  ]"
                >
                  <a-input
                    v-model:value="formState.bookQuantity"
                    :min="1"
                    :max="10"
                    @change="handleSerialNumberChange"
                  />
                </a-form-item>
                <!-- Series -->
                <a-form-item
                  label="Series"
                  name="series"
                  :rules="[{ required: true, message: 'Please select series' }]"
                >
                  <a-input
                    :disabled="true"
                    v-model:value="formState.series"
                    placeholder="Series"
                  />
                </a-form-item>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <!-- Starting Serial Number -->
                <a-form-item
                  label="Starting Serial Number"
                  name="startingSerialNumber"
                  :rules="[
                    {
                      required: true,
                      message: 'Starting serial number is required',
                    },
                  ]"
                >
                  <a-input
                    v-model:value="formState.startingSerialNumber"
                    placeholder="Starting serial number"
                    :disabled="true"
                  />
                </a-form-item>
                <!-- End Serial Number -->
                <a-form-item
                  label="Ending Serial Number"
                  name="endingSerialNumber"
                  :rules="[
                    {
                      required: true,
                      message: 'Ending serial number is required',
                    },
                  ]"
                >
                  <a-input
                    v-model:value="formState.endingSerialNumber"
                    :disabled="true"
                    placeholder="Ending serial number"
                  />
                </a-form-item>
              </div>
            </div>

            <!-- Fourth Section: Delivery Details -->
            <div class="mb-8">
              <h3
                class="text-md font-medium text-primary mb-4 flex items-center border-b border-gray-100 pb-2"
              >
                <CarOutlined class="mr-2 text-accent" /> Delivery Details
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Courier Name -->
                <a-form-item
                  label="Courier Name"
                  name="courierName"
                  :rules="[
                    { required: true, message: 'Please select courier' },
                  ]"
                >
                  <a-select
                    v-model:value="formState.courierName"
                    placeholder="Select courier"
                    class="w-full"
                  >
                    <a-select-option value="">Select Courier</a-select-option>
                    <a-select-option value="DHL">DHL</a-select-option>
                    <a-select-option value="FedEx">FedEx</a-select-option>
                    <a-select-option value="UPS">UPS</a-select-option>
                    <a-select-option value="Local Courier"
                      >Local Courier</a-select-option
                    >
                  </a-select>
                </a-form-item>

                <!-- Severity -->
                <a-form-item
                  label="Severity"
                  name="severity"
                  :rules="[
                    { required: true, message: 'Please select severity' },
                  ]"
                >
                  <a-radio-group
                    v-model:value="formState.severity"
                    class="flex space-x-6"
                  >
                    <a-radio value="Urgent">
                      <span class="text-error font-medium flex items-center">
                        <ThunderboltOutlined class="mr-1" /> Urgent
                      </span>
                    </a-radio>
                    <a-radio value="Normal">
                      <span class="text-warning font-medium flex items-center">
                        <WarningOutlined class="mr-1" /> Normal
                      </span>
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>

              <!-- Remarks -->
              <a-form-item label="Remarks" name="remarks" class="mt-4">
                <a-textarea
                  v-model:value="formState.remarks"
                  placeholder="Enter additional notes or remarks"
                  :rows="4"
                  class="rounded-md"
                />
              </a-form-item>
            </div>

            <!-- Form Actions -->
            <div
              class="flex justify-end space-x-4 pt-6 border-t border-gray-100"
            >
              <a-button
                @click="resetForm"
                size="large"
                class="rounded-md px-6 border-gray-300 text-secondary hover:text-primary hover:border-accent flex items-center"
              >
                <ReloadOutlined class="mr-2" /> Reset
              </a-button>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                class="rounded-md px-8 bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark flex items-center shadow-md"
              >
                <CheckOutlined class="mr-2" /> Preview & Submit
              </a-button>
            </div>
          </a-form>
        </div>
      </div>

      <!-- Help Card -->
      <div class="bg-card shadow-sm rounded-md border border-gray-200 p-6 mb-6">
        <div class="flex items-start">
          <div class="bg-background p-3 rounded-md mr-4 border border-gray-200">
            <InfoCircleOutlined class="text-accent text-lg" />
          </div>
          <div>
            <h3 class="font-medium text-primary mb-1">Need Help?</h3>
            <p class="text-sm text-secondary">
              If you're having trouble with the cheque request form, please
              contact support at
              <a
                href="mailto:support@example.com"
                class="text-accent hover:text-accent-dark font-medium"
                >support@example.com</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>

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
        <div class="bg-background p-5 rounded-md border border-gray-200">
          <h3 class="font-medium text-primary mb-3 flex items-center">
            <UserOutlined class="mr-2 text-accent" /> Request Information
          </h3>
          <div class="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p class="text-sm text-secondary">Requested By</p>
              <p class="font-medium text-primary">
                {{ formState.requestedBy }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Bank Name</p>
              <p class="font-medium text-primary">{{ formState.bankName }}</p>
            </div>
            <div>
              <p class="text-sm text-secondary">Request Branch</p>
              <p class="font-medium text-primary">
                {{ formState.requestBranchName }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Receiving Branch</p>
              <p class="font-medium text-primary">
                {{ formState.receivingBranchName }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Request Date</p>
              <p class="font-medium text-primary">
                {{ formState.requestDate?.format("YYYY-MM-DD") }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Severity</p>
              <p
                class="font-medium flex items-center"
                :class="{
                  'text-error': formState.severity === 'Urgent',
                  'text-warning': formState.severity === 'Normal',
                }"
              >
                <ThunderboltOutlined
                  v-if="formState.severity === 'Urgent'"
                  class="mr-1"
                />
                {{ formState.severity }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-background p-5 rounded-md border border-gray-200">
          <h3 class="font-medium text-primary mb-3 flex items-center">
            <CreditCardOutlined class="mr-2 text-accent" /> Account Information
          </h3>
          <div class="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p class="text-sm text-secondary">Account Number</p>
              <p class="font-medium text-primary">
                {{ formState.accountNumber }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Customer Name</p>
              <p class="font-medium text-primary">
                {{ formState.customerName }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Routing Number</p>
              <p class="font-medium text-primary">
                {{ formState.routingNumber }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Account Type</p>
              <p class="font-medium text-primary">
                {{ formState.accountType }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">MICR Number</p>
              <p class="font-medium text-primary">
                {{ formState.micrNumber }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">TR Code</p>
              <p class="font-medium text-primary">
                {{ formState.trCode }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Cheque Prefix</p>
              <p class="font-medium text-primary">
                {{ formState.chequePrefix }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Customer Address</p>
              <p class="font-medium text-primary">
                {{ formState.customerAddress }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-background p-5 rounded-md border border-gray-200">
          <h3 class="font-medium text-primary mb-3 flex items-center">
            <BookOutlined class="mr-2 text-accent" /> Cheque Details
          </h3>
          <div class="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p class="text-sm text-secondary">Cheque Leaves</p>
              <p class="font-medium text-primary">
                {{ formState.chequeLeaves }} leaves
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Book Quantity</p>
              <p class="font-medium text-primary">
                {{ formState.bookQuantity }} books
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Series</p>
              <p class="font-medium text-primary">
                Series {{ formState.series }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Starting Serial Number</p>
              <p class="font-medium text-primary">
                {{ formState.startingSerialNumber }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Ending Serial Number</p>
              <p class="font-medium text-primary">
                {{ formState.endingSerialNumber }}
              </p>
            </div>
            <div>
              <p class="text-sm text-secondary">Courier</p>
              <p class="font-medium text-primary">
                {{ formState.courierName }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="formState.remarks"
          class="bg-background p-5 rounded-md border border-gray-200"
        >
          <h3 class="font-medium text-primary mb-2 flex items-center">
            <MessageOutlined class="mr-2 text-accent" /> Remarks
          </h3>
          <p class="text-primary">{{ formState.remarks }}</p>
        </div>

        <!-- Modal Footer Actions -->
        <div
          class="flex justify-end space-x-4 pt-6 mt-4 border-t border-gray-200"
        >
          <a-button
            @click="previewModalVisible = false"
            size="large"
            class="rounded-md px-6 border-gray-300 text-secondary hover:text-primary hover:border-accent"
          >
            Cancel
          </a-button>
          <a-button
            type="primary"
            @click="submitForm"
            :loading="isSubmitting"
            size="large"
            class="rounded-md px-8 bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark flex items-center shadow-md"
          >
            <CheckCircleOutlined v-if="!isSubmitting" class="mr-2" />
            {{ isSubmitting ? "Submitting..." : "Confirm & Submit" }}
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
        <div
          class="mx-auto mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-success-light border-4 border-success-lighter"
        >
          <CheckOutlined class="text-success text-4xl" />
        </div>
        <h3 class="text-2xl font-bold text-primary mb-3">Request Submitted!</h3>
        <p class="text-secondary mb-8 max-w-sm mx-auto">
          Your cheque request has been successfully submitted and is being
          processed. You will receive a confirmation email shortly.
        </p>
        <a-button
          type="primary"
          @click="successModalVisible = false"
          size="large"
          class="w-full rounded-md py-3 h-auto bg-accent hover:bg-accent-dark border-accent hover:border-accent-dark text-base font-medium shadow-md"
        >
          Continue
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  BookOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CreditCardOutlined,
  FileAddOutlined,
  FormOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  NumberOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { computed, reactive, ref } from "vue";

// Current date for display
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Form state
const formState = reactive({
  requestedBy: "John Doe",
  bankName: "National Bank",
  requestBranchName: "Main Branch",
  receivingBranchName: "",
  requestDate: dayjs(),
  accountNumber: "",
  customerName: "",
  routingNumber: "",
  accountType: "",
  micrNumber: "",
  trCode: "",
  chequePrefix: "",
  customerAddress: "",
  chequeLeaves: "",
  bookQuantity: 1,
  startingSerialNumber: "0775001",
  endingSerialNumber: "",
  severity: "Urgent",
  courierName: "",
  series: "A",
  remarks: "",
});

// Mock database for account lookup
const accountDatabase = [
  {
    accountNumber: "AC-100001",
    customerName: "John Smith",
    routingNumber: "RT-123456",
    accountType: "Savings",
    micrNumber: "123456789",
    trCode: "123456",
    chequePrefix: "SB",
    customerAddress: "123 Main St, Anytown, USA",
  },
  {
    accountNumber: "AC-100002",
    customerName: "Jane Doe",
    routingNumber: "RT-654321",
    accountType: "Current",
    micrNumber: "123456789",
    trCode: "123456",
    chequePrefix: "CD",
    customerAddress: "456 Main St, Anytown, USA",
  },
  {
    accountNumber: "AC-100003",
    customerName: "Robert Johnson",
    routingNumber: "RT-567890",
    accountType: "Savings",
    micrNumber: "123456789",
    trCode: "123456",
    chequePrefix: "SB",
    customerAddress: "789 Main St, Anytown, USA",
  },
  {
    accountNumber: "AC-100004",
    customerName: "Emily Williams",
    routingNumber: "RT-246801",
    accountType: "Current",
    micrNumber: "123456789",
    trCode: "123456",
    chequePrefix: "CD",
    customerAddress: "1011 Main St, Anytown, USA",
  },
  {
    accountNumber: "AC-100005",
    customerName: "Michael Brown",
    routingNumber: "RT-135792",
    accountType: "Savings",
    micrNumber: "123456789",
    trCode: "123456",
    chequePrefix: "SB",
    customerAddress: "321 Main St, Anytown, USA",
  },
];

// Account search and filtering
const searchValue = ref("");
const filteredAccounts = ref([]);

// Handle account search for autocomplete
const handleAccountSearch = (value: string) => {
  searchValue.value = value;
  if (value) {
    filteredAccounts.value = accountDatabase
      .filter(
        (account) =>
          account.accountNumber.toLowerCase().includes(value.toLowerCase()) ||
          account.customerName.toLowerCase().includes(value.toLowerCase())
      )
      .map((account) => ({
        value: account.accountNumber,
        label: `${account.customerName} (${account.accountType})`,
      }));
  } else {
    filteredAccounts.value = [];
  }
};

// Handle account selection from dropdown
const handleAccountSelect = (value: string) => {
  const account = accountDatabase.find((acc) => acc.accountNumber === value);
  if (account) {
    formState.accountNumber = account.accountNumber;
    formState.customerName = account.customerName;
    formState.routingNumber = account.routingNumber;
    formState.accountType = account.accountType;
    formState.micrNumber = account.micrNumber;
    formState.trCode = account.trCode;
    formState.chequePrefix = account.chequePrefix;
    formState.customerAddress = account.customerAddress;

    // Reset cheque leaves when account type changes
    formState.chequeLeaves = "";

    message.success("Account information loaded successfully");
  }
};
const handleSerialNumberChange = (value: number) => {
  const chequeLeaves = formState.chequeLeaves;
  const bookQuantity = formState.bookQuantity;
  const firstLeafNumber = Number(formState.startingSerialNumber);
  if (value && chequeLeaves) {
    const chequeLeavesNumber = Number(chequeLeaves);
    const Qty = chequeLeavesNumber * bookQuantity;
    formState.endingSerialNumber = String(firstLeafNumber + (Qty - 1));
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
    receivingBranchName: "",
    requestDate: dayjs(),
    accountNumber: "",
    customerName: "",
    routingNumber: "",
    accountType: "",
    chequeLeaves: "",
    bookQuantity: 1,
    firstLeafNumber: "",
    severity: "Medium",
    courierName: "",
    series: "A",
    remarks: "",
  });

  message.success("Form has been reset");
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
:deep(.ant-input-affix-wrapper),
:deep(.ant-textarea) {
  border-radius: var(--radius-md) !important;
  transition: all 0.3s;
  border-color: #e2e8f0;
}

:deep(.ant-input-affix-wrapper .ant-input) {
  border-radius: 0 !important;
}

:deep(.ant-btn) {
  border-radius: var(--radius-md);
  transition: all 0.3s;
}

:deep(.ant-btn-primary) {
  background-color: var(--accent-cta);
  border-color: var(--accent-cta);
}

:deep(.ant-btn-primary:hover) {
  background-color: var(--accent-dark);
  border-color: var(--accent-dark);
}

:deep(.ant-input:focus),
:deep(.ant-input-number-focused),
:deep(.ant-picker-focused),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-input-affix-wrapper-focused),
:deep(.ant-textarea-focused) {
  border-color: var(--accent-cta) !important;
  box-shadow: 0 0 0 2px rgba(107, 142, 35, 0.2) !important;
}

:deep(.ant-input:hover),
:deep(.ant-input-number:hover),
:deep(.ant-picker:hover),
:deep(.ant-select:hover .ant-select-selector),
:deep(.ant-input-affix-wrapper:hover),
:deep(.ant-textarea:hover) {
  border-color: var(--accent-cta) !important;
}

:deep(.ant-radio-wrapper .ant-radio-checked .ant-radio-inner) {
  background-color: var(--accent-cta);
  border-color: var(--accent-cta);
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: var(--text-primary);
}

:deep(.ant-modal-content) {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

:deep(.ant-modal-header) {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--background);
  padding: 16px 24px;
}

:deep(.ant-modal-title) {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.125rem;
}

:deep(.ant-modal-close) {
  color: var(--text-secondary);
}

:deep(.ant-modal-body) {
  padding: 24px;
}

:deep(.ant-select-item) {
  padding: 8px 12px;
}

:deep(.ant-select-item-option-active:not(.ant-select-item-option-disabled)) {
  background-color: rgba(107, 142, 35, 0.05);
}

:deep(.ant-select-item-option-selected:not(.ant-select-item-option-disabled)) {
  background-color: rgba(107, 142, 35, 0.1);
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
