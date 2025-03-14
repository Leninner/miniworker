declare module '@/components/GroupMembers.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{
    groupId: {
      type: StringConstructor;
      required: true;
    };
    editable: {
      type: BooleanConstructor;
      default: boolean;
    };
  }, {}, any>;
  export default component;
} 