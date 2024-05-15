import AlertTriangle from 'lucide-svelte/icons/triangle-alert';
import ArrowRight from 'lucide-svelte/icons/arrow-right';
import Check from 'lucide-svelte/icons/check';
import ChevronLeft from 'lucide-svelte/icons/chevron-left';
import ChevronRight from 'lucide-svelte/icons/chevron-right';
import ClipboardCheck from 'lucide-svelte/icons/clipboard-check';
import File from 'lucide-svelte/icons/file';
import FileText from 'lucide-svelte/icons/file-text';
import HelpCircle from 'lucide-svelte/icons/circle-help';
import Image from 'lucide-svelte/icons/image';
import Laptop from 'lucide-svelte/icons/laptop';
import Loader2 from 'lucide-svelte/icons/loader-circle';
import Moon from 'lucide-svelte/icons/moon';
import Plus from 'lucide-svelte/icons/plus';
import Settings from 'lucide-svelte/icons/settings';
import SunMedium from 'lucide-svelte/icons/sun-medium';
import Trash from 'lucide-svelte/icons/trash';
import User from 'lucide-svelte/icons/user';
import X from 'lucide-svelte/icons/x';
import LogOut from 'lucide-svelte/icons/log-out';
import Search from 'lucide-svelte/icons/search';

import Google from './google.svelte';
import Github from './github.svelte';
import Logo from './logo.svelte';
import Hamburger from './hamburger.svelte';
import { ChevronDown, ClipboardPen, Users, Warehouse } from 'lucide-svelte';

const Icons = {
	logo: Logo,
	close: X,
	spinner: Loader2,
	clipboard: ClipboardPen,
	workshop: Warehouse,
	chevronLeft: ChevronLeft,
	chevronRight: ChevronRight,
	chevronDown: ChevronDown,
	trash: Trash,
	post: FileText,
	page: File,
	media: Image,
	settings: Settings,
	add: Plus,
	warning: AlertTriangle,
	user: User,
	users: Users,
	arrowRight: ArrowRight,
	help: HelpCircle,
	check: Check,
	copyDone: ClipboardCheck,
	sun: SunMedium,
	moon: Moon,
	laptop: Laptop,
	google: Google,
	github: Github,
	hamburger: Hamburger,
	logout: LogOut,
	search: Search
};

export default Icons;
