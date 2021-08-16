import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import Wallet from '../features/wallet/Wallet';
import {
  Link as ReactRouterLink
} from 'react-router-dom'

interface NavBarProps {
  title: string;
}

const NavBar: React.FC<NavBarProps> = (props) => {
  const {title} = props;

  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        {/* This is the hamburger icon where the */}
        <HamburgerMenu
          isOpen={isOpen}
          onToggle={onToggle}
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
          backgroundColor={'green'}
        />
        <DesktopNavbar
          title={title}
          flex={{ base: 1 }}
          justify={{ base: 'center', md: 'start' }}
          backgroundColor={'blue'}
        />
        <WalletSection
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
          flexShrink={1}
          backgroundColor={'red'}
        />

      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

type FlexProps = React.ComponentProps<typeof Flex>

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps & FlexProps> = (props) => {
  const {isOpen, onToggle, ...rest} = props;

  return <Flex
    {...rest}
    >

    <IconButton
      onClick={onToggle}
      icon={
        isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
      }
      variant={'ghost'}
      aria-label={'Toggle Navigation'}
    />
    </Flex>
}

interface DesktopNavbarProps {
  title: string;
}

const DesktopNavbar: React.FC<DesktopNavbarProps & FlexProps> = (props) => {
  const { title, ...rest } = props;
  return <Flex
    {...rest}
  >
    <Text
      textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
      fontFamily={'heading'}
      color={useColorModeValue('gray.800', 'white')}>
      {title}
    </Text>

    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
      <DesktopNav />
    </Flex>
  </Flex>
}


const WalletSection: React.FC<FlexProps> = (props) => {
  const {...rest} = props;

  return <Flex
            {...rest}
          >
            <Wallet/>
        </Flex>
}
const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                as={ReactRouterLink}
                p={2}
                to={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.subNav && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.subNav.map((child: SubNavItem) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

interface DesktopSubNavProps {
  label: string;
  href: string;
  subLabel: string;
}

const DesktopSubNav: React.FC<DesktopSubNavProps> = (props) => {
  const { label, href, subLabel } = props;

  return (
    <Link
      as={ReactRouterLink}
      to={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

// TODO get more specific with nav item props
interface MobileNavItemProps {
  label: any,
  subNav?: any,
  href?: any
}

const MobileNavItem: React.FC<MobileNavItemProps> = (props) => {
  const {label, subNav, href} = props;

  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={subNav && onToggle}>
      <Flex
        py={2}
        as={Link}
        to={href}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {subNav && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {subNav &&
            subNav.map((child: SubNavItem) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface SubNavItem {
  label: string;
  href: string;
  subLabel: string;
}

interface NavItem {
  label: string;
  href?: string;
  subNav?: SubNavItem[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'YTC Creator',
    href: '/creator'
  },
  {
    label: 'YTC Calculator',
    href: '/calculator'
  },
  {
    label: 'Analytics',
    subNav: [
      {
        label: 'Top Products',
        subLabel: 'Trending fixed interest rate products',
        href: '#',
      },
      {
        label: 'YTC Analytics',
        subLabel: 'Understand the best YTC strategies',
        href: '#',
      },
    ],
  }
];

export default NavBar;