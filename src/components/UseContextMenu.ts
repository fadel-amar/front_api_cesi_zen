// composables/useContextMenu.ts
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';

export function useContextMenu() {
  const actionMenuId = ref<number | null>(null);
  const menuRefs = ref<{ [key: number]: HTMLElement | null }>({});
  const menuPosition = ref({ top: 0, left: 0 });
  const currentButtonRef = ref<HTMLElement | null>(null);

  const updateMenuPosition = () => {
    if (!currentButtonRef.value || actionMenuId.value === null) return;

    const rect = currentButtonRef.value.getBoundingClientRect();
    const menuWidth = window.innerWidth < 640 ? 128 : 144;
    const menuHeight = 80;

    // Position horizontale - utiliser directement rect.left (pas besoin de scrollX)
    let left = rect.left;

    if (left + menuWidth > window.innerWidth) {
      left = rect.right - menuWidth;
    }

    if (left < 8) {
      left = 8;
    }

    // Position verticale - utiliser directement rect.bottom (pas besoin de scrollY)
    let top = rect.bottom + 4;

    if (top + menuHeight > window.innerHeight) {
      top = rect.top - menuHeight - 4;
    }

    if (top < 8) {
      top = 8;
    }

    menuPosition.value = { top, left };
  };

  const openActionMenu = (id: number, event: MouseEvent) => {
    if (actionMenuId.value === id) {
      actionMenuId.value = null;
      currentButtonRef.value = null;
      return;
    }

    actionMenuId.value = id;
    currentButtonRef.value = event.currentTarget as HTMLElement;

    nextTick(() => {
      updateMenuPosition();
    });
  };

  const closeMenu = () => {
    actionMenuId.value = null;
    currentButtonRef.value = null;
  };

  const handleScroll = () => {
    if (actionMenuId.value !== null) {
      actionMenuId.value = null;
      currentButtonRef.value = null;
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (actionMenuId.value === null) return;
    const menu = menuRefs.value[actionMenuId.value];
    if (menu && !menu.contains(event.target as Node)) {
      closeMenu();
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
  });

  return {
    actionMenuId,
    menuRefs,
    menuPosition,

    openActionMenu,
    closeMenu,
  };
}
