import React, { useState, useRef } from 'react';
import { Button, Typography, Box, AppBar, Toolbar, Container, Pagination, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import { CSSTransition } from 'react-transition-group'; // Import CSSTransition for animation

const HomePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [objectType, setObjectType] = useState('');
  const [fadeIn, setFadeIn] = useState(false); // State to manage fade-in effect
  const [loading, setLoading] = useState(false); // State to manage loading progress
  const resultsPerPage = 4;
  const resultSectionRef = useRef(null); // Reference for results section

  // Simulated result data (you would replace this with actual search results)
  const simulatedResults = [
    { id: 1, title: 'iPhone 16', description: 'Apple iPhone 16 Pink', image: 'https://images.apple.com/v/iphone-16/c/images/overview/product-viewer/iphone/pink__gifyysu3c32i_xlarge.jpg' },
    { id: 2, title: 'iPhone 16', description: 'Apple iPhone 16 Green', image: 'https://images.apple.com/v/iphone-16/c/images/overview/product-viewer/iphone/green__rbnj2er55kam_xlarge.jpg' },
    { id: 3, title: 'iPhone 16', description: 'Apple iPhone 16 Blue', image: 'https://images.apple.com/v/iphone-16/c/images/overview/product-viewer/iphone/blue__cevjmd4i0xsi_xlarge.jpg' },
    { id: 4, title: 'iPhone 16', description: 'Apple iPhone 16 Silver', image: 'https://images.apple.com/v/iphone-16/c/images/overview/product-viewer/iphone/white__gi24mh5phya2_xlarge.jpg' },
    { id: 5, title: 'iPhone 15', description: 'Apple iPhone 15 Pink', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-15-model-unselect-gallery-2-202309_GEO_EMEA?wid=5120&hei=2880&fmt=webp&qlt=70&.v=aVFiZEF4WDEvUWJNSU5HRDg4cklnTGdzSmpObkZCM3MrNmJ5SkhESlNDZ2lGQTRGNnVYNjZ6NWNNT2RQbEdmK3ovdld4NkVCZ3JUZXJyZ1dUb1MwM0dKTG1lVWJJT2RXQWE0Mm9rU1V0V0JCV3NjNWl1UW9rVFRPUVBJRWJDd2NQb3R0UW1Yc3h6Um5aMXhHRitCYTBB&traceId=1' },
    { id: 6, title: 'iPhone 14', description: 'Apple iPhone 14 Yellow', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-14-model-unselect-gallery-2-202303_GEO_EMEA?wid=5120&hei=2880&fmt=webp&qlt=70&.v=NjB6M3BqTGRudDZtakJrUG5tT2pHTGdzSmpObkZCM3MrNmJ5SkhESlNDZ1hBSXMwL2Jwdk9oTk42KzZHdTdNUXovdld4NkVCZ3JUZXJyZ1dUb1MwM0dKTG1lVWJJT2RXQWE0Mm9rU1V0V0IxZG1zQmhZY3FpN094bFJrYnF5eDR2azA1RzdtcFQ5a1dBaURTY0hJUEJB&traceId=1' },
    { id: 7, title: 'iPhone 13', description: 'Apple iPhone 13', image: 'https://www.apple.com/v/iphone/home/bx/images/overview/select/iphone_14__eso1fig4ci6a_xlarge.png' },
    { id: 8, title: 'iPhone SE', description: 'Apple iPhone SE Gray', image: 'https://www.apple.com/v/iphone/home/bx/images/overview/select/iphone_se__cuaa2bdndqeu_xlarge.png' },
  { id: 9, title: 'Samsung Galaxy S21', description: 'Samsung Galaxy S21', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSuytzsjcKuY83rn1365gcgbfMSFaPM-HH2BuXV-bRpnXzshCywhNvYU0Ya85j1UiYA53VTisYwSK4oLGHItCSgfJm6JNzMMHXTP9PpRHPt07tUvgFfsZxk' },
  { id: 10, title: 'Google Pixel 6', description: 'Google Pixel 6', image: 'data:image/jpeg;base64,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' },
  { id: 11, title: 'OnePlus 9', description: 'OnePlus 9', image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PEA8PEBAODg0QEBAPDg0PDw8NDw8NFRIYFhURFRUYHiggGBslHRUVITEhMSkrLi46FyAzOjMtQygxLisBCgoKDg0OGxAQGy0fHh8tKy0rKystLy0tLSstKy0tKy02LSsrLS8tKysrKy0tLiswLS8xKystLS0tLS0yLS0tLf/AABEIAOAA4AMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwUCBAYHAf/EAEoQAAEDAQQCDQgHBgUFAAAAAAEAAgMRBAUSIQYxEyIjMzRBUVJxcnOxszJhdIGUobLSFBYkVZG0wRVCYpPR0weCkuHwRWODosL/xAAaAQEBAAMBAQAAAAAAAAAAAAAAAQIDBAUG/8QANREBAAIABAIIBAYCAgMAAAAAAAECAwQRMRIhBRMyQVFhgfAiM5HRFCNxobHBFeEkNEKC8f/aAAwDAQACEQMRAD8A9xQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEHFNvuS2vkcySSKysdhjZG7Y3SDie5422eugIpXOq6owYiImXHbHmZmI2h9NefaParT86y6uGHW2Yknn2j2q0/OnVwdbZiXnn2j2q0/Or1dTrbMTKefP7VafnTqqnW2YOndz5/arT86vVVTrrMDanc+f2m0/OnU1OuswNsfz5/abT86vU1Ots4rSPSa8XTmCxySxMjAMs7p7Q7MnIAF2eo5DzHjCxw8vOLfhpyiO+VxM1TBrE4k852hno3PeFtcY/206KapDWmOWQP5QHbMNt5lcbKTSvFWYtHfp3Lh5uLW4bRNZ7te90f1Wvf76f7PN/fXLo6OOPch0Wvj77ePP9Hl/vJocce5YfVO+fv2X2Z/8AdTSTjg+qd8/fsvsz/wC6ppJxwyborfA/628+c2eX9JldDjhl9Vr3++n+zzf300OOHz6rXv8AfT/Z5v76aHHCKz3xfNz2iEW2Vt43bM/YzO0O2WFxFRUGrgcjTNwNKZEhYzDOLa7PVgQRUZg5gjMELFm+oCAgICAgICDWvI0hmpr2KSn+kqwk7PPdGXYYZjrpJIadHEvQxHl4bavu22axRB9p3R7qgNwh5c4a8DXGjWiozy4q1Jz0zbRviurnLt0rsFqk2JkexSHyBJHFR9NYaW1z82StcSNdJW+FMRrErCZtDtNzPEWbX8RqPQV0cMObilv2WfGxrjkcw4DViBINPNUFYsn1xVRG4qiJxVgcrMwCSTziGvs0QWzJR+X+sy8rpeZ/ER5RH9q+77qZZy5zS95JbUPIG1b5IBAFCOIrfgYNcLXTvasfP3x9OLlptMePj/p6Lcd/bRuzPxxeSLScnMdzJxxH+PUeOms8mYynPXD+n2+zvyXSHF+Xjcp8e6XSrz3rPqD4g+oogIKrSeJr7M4OFRslmd622iMjuUnZlTd0dxOJstlJzJs8JJ8+xha5b4byAgICAgICAg1rz3ibspPhKsJOzzvR3eLR2kn6r0MR5eEp/wDFixSPbDM1pfGzE2Rortcw4E04jmK8VByrntyl105xo4CxvktdpsojjwmLAzGAKlrK0xuAGI0oK01BL247REQypXq6zMy9PnK7YefLYuw7l/nl8Ry1tidxVRE4qiJxVHNWk7o/oh/LxrbkvlesvK6X/wCx6Q+BdbypSWa0PhdjjoaijmHyXt5CnKeUsqzE8rOguC/8JwMDnwjM2Y79COMxc9o5nFxc1c2Yy0X+LafHun9fv9XrZLOYmFpTF5x3S7CzWhkrQ+Nwex2pzdWWRHmI1EcS8q1ZrOk8pe5W0WjWJ1hKsVfUHxARVdpDwd/Xg8dik7Mq7r+4OCWT0eDw2rXLe30BAQEBAQEBBrXnvE3ZSfCVYSdnnWjm8WjtJP1XoYjy8Jb3va4omOfM5jIhkS+lCTqFOM5HIZ5LXMxG7bFZmeTmbBe9hmc5tmdHsnGMBie4dDgCQssO1ddI5GJS+ms81rNa4Po5jwbtzsLa1xVxYtdKcScF+s4teRx4fV8OnNBdZ3IdeXxHLY1p3FEROKyELiqObtZ3V/RD+XjWzJfK9ZeX0t8/0hi0rreVKRpUYy+OjzDmktcDVrgaEEaiDxFXVnTEmvKdl3ct+nHhc5sNpdQY3ZQWo6g2UDyX8QePNr8laMXAi0eX7x+nl5PUy+atTnE6x73+/wBfF2dht7ZatoY5mU2SF1MTeRwIyc08Th7jUDy8TCmn6eL28LFriRy+jbWpsEBBXaQ8Hf14PHYpOzKm6/uDglk9Hg8Nq1y6G+gICAgICAgINa894m7KT4SrCTs840dO4Wjry/qvRxHl4bmP8WpZMcDc9iDHluumyE7Y/gG+9c193XhbOBs8wE1nNnDhKC0OILjjkxZOAOqoIFFjfh1jg9y2V4tJ4/cPXZ3HB5sfvou/ved3J7sO5Dry+I5YMkziqInFUROKyhXO2sbo/oh/LxrPJfK9ZeV0tP8AyPSGDV1vLlIFGEpGqIitUQcMxVWJ0bMO81s2GXlamshLHh0kZYWSmuyNjcXAtPLTAK8oOorrwsDBxInj2nX+vu78LFmttazpp/r9vJ6Bct6C0NIcME7KCWPkPE5vK0/7L5/NZacG3jE7T773uZbMVx66xv3rJczoFBXaQ8Hf14PHYpOzKm6/uDglk9Hg8Nq1y6G+gICAgICAgING/HltltLhrEEpHHngKsbpbZ55o7vFo7ST9V6OI8vDTaTx2Z8EhtQBhYC9xNat4qtIzrqHnqFrmK6fE2Um0T8LkNGLNdry+ayh7pYzhds2+R4gaEDVnQ0PmKuFWmusMsW2JEaWXM0nF0nuXQ5m9dh3IdaTxHLWzTOKohcVkIiVVVUlmJc51DTcs6ZcHjWWSn8r1l5PS1ZnMa+UIzZyuvV5eks4bK9zmtaC5znBrRyuJoB+JUmYiNZIpa0xEbzybsFy2h7zGI3B4JDgdrQjXn6lhOJSI4teTZXK4trcEV5t/wCq8mGuNmLm596x66rfGRvprq5u32Z0bqEOa5p1aiDxjuI/3XdlsWInylcOdOU7t27bfIJGzxUMzRV7K0Ejf3v8rqDqmnIK54+DS1Zpbae/wn/X7w2YWLOBbWPfk9Du+2MnjbKw7Vw1HJzXcbSOIgr5rFwrYV5pbeH0WHeL1i1dpbK1sldpBwd/Xg8dixtsypuu9GHl1isbjrNmgJ4s9jasJb4WaiiAgICAgICDVvQAwTggEbFJUEVB2p4lY3Sdnm+jDcUM7TXOWRtRrzJXo4jysNHf8ItEElnmEjcYAL443vbiDg5r20B4wDhPR51jMRMaS2RM1nWHOaNXELCJdvJNJKWAu2CSNrWMrhaBnzjx8nImFStOeuq4t7X7tFmY3udtWPJpShY5jdesuIyW3ihq4ZW1ni2NjWVqQMzqq4mpP4kqQsjiqInFVUTiqi40faDE6oB2zNfo8S0ZefhYZyNcT0hZfRY+Yz/SF0cU+Lj6uvg2LHE0SR0aBt2agOcFrxLTwz+kt2DWIvXl3x/Lfh278X77MQd/EyhAPq1fgue3w107pddPjvr3xrr+nvkYGAhuRGAHJlXHa1xYv+BXW2/n4nDWJ4fLw57b6tO23NZ7QayMaRJga3lw1DnNHJqw11jEaLKMa9Y0idvcfdrtlsO9uKY300/mft68nNWSwQmZmNkZkjtLQNisv0VtHRvLonkZOOQIOZyOea7Jx8StJiJnSY751745tGDXCvbS2k6TpyrpG08vPxjvhT3DpQWTF8jY44ZKCaOJpYxnJMBmSRqcdZGvUF6Oc6PjEw/gmZtG2vOZ8vt3eG7DLZjgttEVnw7vfe9EB9Y4iMwQvmXrq7SDg7+vB47FjOzKm6/0fH2SyUAH2eHICg3sLXLoWCAgICAgICAg0b+eW2W1OGREExB15hhVjdLbPO9Ejuc3bP716V3lUWjisWSJxVRE4rIROKIicVkqFxVVG4oi60b3o9Mf5eJaMv2GGc+Z6QtwtzmSQ+U3PDthttWHPWsbbSzp2o56NmRuGu1fGf3X1JDvMT5wtUTr3xLfaOHXlNfPxMLwMOLICpZi1DzhNa666epw3iNNfTVJLBQO21QymEYtVcysa31mOW7O+HpE89tlfpBdj564ZXMkic7YXmRzdtTMV6ONbMHErWOcb78mjNYF7zrW2k1nlrPv6vKbwsjoZHxvBa4EtLOPZAaZHiNK58frqvey2PMxER37T77v4l5tYmOUxpMcp8vf/wAd1oJe2zROgJaXQhmAtyBhOQFOIggj1heT0ngcF4xI/wDLf9f9/d6+SxJmnDPd/C30g4O/rweOxeVOzupuvNF3E2Gxk5k2aCv8sLCW+NlmoogICAgICAg0L/aTZLUAKk2eYADjOxlWu6W2edaJHcpu2f3leld5VFo8qMkTiqiJxVETiqiFxVVE4qiNxVVd6N70emP8vEufL9hrznzPSFuFucySJwBBIqK5jlHIsbRrHJnWYiYmebYY9rQ6jnODmkBhbQZ8Zz4lrmJmY1hui1axOkzOvckktAOI1NXA7XA0UJ11dxjWsYpMaR4M7YsTrOu/dpH8j5WnHmdsG0y1OHFr96RWY08i16zr56fskfaA6ueEYiQcDXVB6ePJYxSYZzixby5+GrzTTUj6a45kOLS4E0LhRuRp0L1crGlIePjTrjXn9P4Xmj1sYZw0RMje5jhiY0DE0Z0PHxKZ/BmMHi110mG/o+8zien2XGkHB3deDx2Lw52e3Tdd6LNIsNiByIssFR/4wsJb42WiiiAgICAgICDWvLeZuyk+Eqwk7PMtETuU3bP7yvSu8qi0eVFRPKoicVUQuVED5BXDXbUxU48NaVWSsHFUROKKvtHN6PTH+XiXPl+w15z5vpC3C3OVkEZMgsVZBRlDIKK+qMnnWlL8VtcOQtHuH9F6eXj4YeZiT8d597LTR0fa4urJ8BWef/61vT+W/o/5sfpLpdIODv68HjsXzs7Pepu6C4OCWT0eDw2rVLob6AgICAgICAg1ry3mbspPhKsbpOzzDRE7lN2z+8r0rPKotHlFQuKqInFBTXgB9qkLQ90bA5oc5zW0EdTq/wCdGtZwProIzO11Dsmx4v4fKArr1qxsrZcUERKo6DR7e3daP8vEubL9hrznzfSFsFvczIKMmQUVkFFhksWT6ivMbwk2S2SO/wC478M6L1sGNIiPJ5Vp1iZ8Zn+XQ6OD7U3zRyH3AfqsekP+vP6w7Oj/AJnpLodID9nf14PHYvnp2e5Td0NwcEsno8HhtWqXQ30BAQEBAQEBBrXlvM3ZSfCVY3SdnluiB3Kbt3969KzyqrV5RULiqiJxVGjNZauc4SSsLqVDC0A0FBrBWQijswa7GXyPdhw7ctNG1rxAciqs3FBGSqOh0d3p3WZ4ES58v2GvOfM9IWwW5zMworIKKyCjJkFGTC0yYGPdzWud+AqlY1nRje3DWZeXWLbSk+c969jDeZPKkQ6rRgfaj5oJD/7xj9Vo6Rn/AI//ALR/Eu7o6PzPT7L7SHg7+vB47F4E7Pbp2nRXBwSyejweG1anRDfQEBAQEBAQEGteW8zdlJ8JVjdJ2eWaIHcpu2f3r07PKqs3lFROKIhcVkInFVUTyqInFURkqjo9Hd7d1meBEubL9hrzvzfSFsFucsMgoyZBRWQUVmFGUKzSWfBZZTyjD+Jz91VswY1vDTmZ/LmPHk4C6G516F62G4sV1uird3kPJFT8Xt/ouPpOfyax5/1L0Ojo+KZ8lzpDwd/Xg8di8OdnsU3dFcHBLJ6PB4bVqdEN9AQEBAQEBAQa15bzN2UnwlWN0nZ5Vogdym7Z/eV6dnk1WbyioXFUROKoicVVQuKojcVRGVR0mju9O6zPAiXNl+w1Z35vpC2C3uaGYWKsgoyZBRWQUZOZ08tFIWM43Or6hl+q6ctHOZcuYnW1Y9XM3S3vP9F6VNocl93V6IjdLQeRkQ/Ev/ouDpSfgpHnP9PU6Ojten9rXSLg7+vB47F4s7PWpu6O4OCWT0eDw2rU6G+gICAgICAgINa8t5m7KT4SrG6Ts8o0QO5Tds/vK9OXk1WbyioXFZCFxVVE4qiJxVEbigwKo6TRzendZngRrmy3Yas7830hbBb3KzCjJkFFZBRkyCiuE05tGKdrOJjR+Os94XZgRpTVxYk64k+UaNS7G5DoXoaacmie06vRBuVodyuY38AT/wDS8rpWedI8p9/s9jo+PgmfNv6R8Gk60PjMXkTs9Km7pLg4JZfR4PDatbob6AgICAgICAg1ry3mbspPhKsbpOzyXQ87lP28neV6cvKqs3lWBC4qiJxVVE4qiJxVEZKoxKK6TRvendZvgxrny3Yac7830hbhbnKyCiwzCjJ9CivpNFF1eXXxaNlnkfyuoPWcvdRenhV2hwUnWOLxnVZWAZHoXS1Ru6vRFlIZXc6dxHQGMHeCvH6UtrixHhX+5e5kK6YWvjLa0k4NJ1ofGYvLts76dp0lwcEsno8HhtWt0Q30BAQEBAQEBBrXlvM3ZSfCVY3Sdnkeh53Kft5O8r05eVCzeVYELishE4qiJxVVE4oMCqMSqro9Gt6d12+DGubLdhpzvzfSFwFvcjIKMoZhYqyCjJpX3aNjgkdqJbhHSclnhxrZpzFuHDl5kw1dXldX1L1MKPi/SGjTSNHQWUUYSs4aq7uv0YZSyQnnh0nqe8uHuIXhZ+3FmLeXL6Ro+gyteHCr73fdJeCydaHxmLhts6qbul0f4JZPRoPDatcuiG+gICAgICAgINa894m7KT4SrG6Ts8h0PO5T9vJ3lenLyYWUhWSoXFUROKoicVVRkqjAor4qOj0a3p3Xb4Ma5st2PVozvzfSFwFvcrIKKzCjJkFFcvpxa6MbGDmcz68h+q6cCve5ceeK8V9XI2RlXgcgXfhdmZYXnkubwJDGQs3yVzY29ZxpX3rZh6RredoKV15PRIIgxrWNyaxrWN6rRQdy+VtabWm0976OI0jRX6S8Fk60PjMWE7M6bul0f4JZPRoPDatUuiG+gICAgICAgINa894m7KT4SrG6Ts8f0QO4z9vJ3lepLyoWTyqIXFZCJxVVE4oIyVVYlB8VHR6Nb07rt8GNc+W7DRnfm+kLgLe5GQUZMwsVZVUV51pLatlnPIDl0DIfqu6kcNXFWeK1rPlyxeVIdQXXEaVipbnOjb0ZH0m8GPPkQtdIPVtW+91Vrz1+ry0xHfy+/wCzsytNcSPr9P8Aej0ZfNPYVekvBZOtD4zFLbMqdp02j/BLJ6NB4bVql0w30BAQEBAQEBBrXnvE/ZSfCVY3Sdnj2iR3Gbt5PiK9R5ULB5WQhcVRE4qqjcVRgUViqPiDo9GzuTuu3wY1oyvYc+e+b6QtwVvcsJAsVZBRWretp2OJ7uOlB0lZUrrLXjX4aS81eS95PGTQdy7qxrMQ01jhrELG8H7DC2MeU4Z9C6qc54ikazqvv8N7LRk85HlvEbT/AAsFT73e5eX0tic64fhzerk6729HZLx9HcrNJeCydaHxmKW2Z03dNo/wSyejQeG1apdEN9AQEBAQEBAQat6bxP2UnwFWN0nZ49onvM3byd5XqPKhvvKyEDislRuKCNxVViVRiiiC70WtLXMlaDmyRgcOmzxOB9/uWjK9iY8JcufjTFifGIXrSuiYckSkaVjLJlVRk5XS23ZYAdXedS6MKrjxJ47xXwUV0QVdiPksFT0rqpHeyvOvJpXracb3O4hkOgLriNobaQ9P0XsewWSzxkUdgD3j+N+2PfT1L5rO4nWY9p89Ppyexl68OHH1+q0XK3KbS60Njsjy40xS2Zg87nWiMAfr6ipbZlTtOsuEEWSyg5EWeEEefYwtMumG+gICAgICAgIPhCDzWfRWawySiJkktkkfjjdGx0ro6/uPa2rvXQg+bUu3Dx400tu4b5eYnWuzXdd8nNm9ltfyLb19GHVW8ERuyXmzezWv5FevodVfwYm6pebL7Na/kV6+h1V/Bj+yJuZL7NavkTr6HV28GJuebmS+zWr5E/EUXq7eD5+x5uZL7NavkV/EUOrt4H7Hm5kvs1q+RPxFDq7eDnbwuS97JafpVgZLJsjQyaA2a0FrgCcOJpYK0qaEZjv5JvwXm2HO7ZbCri04cSNu9stvvSMa7tir6PbR7qrL8Xfwhq/x+F4z79GQv7SP7si/kWz+qn4q/hC/gMPxn36Prr/0jOX7Mi/kWz+qRmr+EE5DDnvn36Ka2R3/ADOxOsArWuUNqA962xn8SO6Pfq1V6LwqzM6zz9+DKJt/MYWC72jFrdsNqqs69J4tdOUe/Vf8ZheM+/RpG7b7JFbBUVBI2G1UPmK2f5bGjaI9+rP/AB+H4z79HV/WnST7rg9nt3zLzOKXZ1dT606S/dcHs9u+ZOKTgqyuzRu/b5tUEl5AWOwQO2TYWNdDidShwsccZdQkYj5NTTkOMz4sq1iNntbQAAAKAZADIALFm+oCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIP/9k=' },
  { id: 12, title: 'Xiaomi Mi 11', description: 'Xiaomi Mi 11', image: 'data:image/jpeg;base64,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' },
   
  ];

  const totalPages = Math.ceil(simulatedResults.length / resultsPerPage);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setResults([]); // Clear previous results
      setObjectType(''); // Clear previous object type
      setFadeIn(false); // Reset fade-in effect
      setLoading(false); // Reset loading state
    }
  };

  const handleFindPic = () => {
    if (selectedImage) {
      // Set loading to true to show the progress bar
      setLoading(true);
      setFadeIn(false); // Reset fade-in effect

      // Simulate a delay to represent processing time
      setTimeout(() => {
        // Logic to find pic will go here
        console.log('Finding Pic...');
        setObjectType('iPhone'); // This should be replaced with actual object detection result
        setResults(simulatedResults); // Replace with actual results fetching
        setFadeIn(true); // Trigger fade-in effect
        setLoading(false); // Hide the progress bar after processing
         // Scroll to the results section when results are retrieved
         // Scroll to the result section after results are rendered
      setTimeout(() => {
        if (resultSectionRef.current) {
          console.log('Scrolling to results...');
          resultSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Delay the scroll to ensure results are visible
      }, 2000); // Simulate a 2-second loading time
    }
  };

  const handleClear = () => {
    setSelectedImage(null); // Clear the uploaded image
    setResults([]); // Clear the results
    setObjectType(''); // Clear object type
    setFadeIn(false); // Reset fade-in effect
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Get results for the current page
  const displayedResults = results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  // Styled components
  const MainContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  });

  const ContentBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    padding: '20px',
  });

  const Title = styled(Typography)({
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  });

  const UploadBox = styled(Box)({
    width: '300px',
    height: '300px',
    border: '2px dashed #888',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      border: '2px dashed #333',
    },
  });

  const StyledButton = styled(Button)({
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderRadius: '8px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  });

  const Footer = styled(Box)({
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 0',
    textAlign: 'center',
  });

  const ResultsBox = styled(Box)({
    marginTop: '40px',
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    overflow: 'hidden', // Hide overflow for animation
  });

  const ResultItem = styled(Box)({
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ccc',
  });

  const ResultImage = styled('img')({
    width: '100px',
    height: '100px',
    borderRadius: '10px',
    objectFit: 'cover',
    marginRight: '20px',
  });

  // CSS animation styles
  const animationStyles = {
    enter: 'animate__animated animate__fadeInRight', // Animation class for entering
    exit: 'animate__animated animate__fadeOutLeft', // Animation class for exiting
  };

  return (
    <MainContainer>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PicFinderAI
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Content Section */}
      <ContentBox>
        <Title>Welcome to PicFinderAI</Title>
        <Typography
    variant="subtitle1"
    style={{
      marginBottom: '20px',
      fontStyle: 'italic',
      color: '#333',
      textAlign: 'center', // Center the text
      fontWeight: '600', // Make the font slightly bolder
      fontSize: '1.2rem', // Adjust font size
      textTransform: 'uppercase', // Uppercase letters
    }}
  >
    Unleashing the Power of Visual Recognition
  </Typography>

        <label htmlFor="upload-image">
          <UploadBox>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Uploaded"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
              />
            ) : (
              <Typography>Click here to upload an image</Typography>
            )}
          </UploadBox>
        </label>
        <input
          id="upload-image"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
       
        <Box display="flex" gap={2} justifyContent="center" alignItems="center" marginTop={2}>
          {/* Find Pic Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleFindPic}
            disabled={!selectedImage}
            ref={resultSectionRef}
          >
            Find Pic
          </Button>

          {/* Clear Button */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClear}
            disabled={!selectedImage && results.length === 0}
          >
            Clear
          </Button>
        </Box>


        {/* Loading Progress Bar */}
        {loading && <LinearProgress style={{ width: '100%', marginTop: '20px' }} />}

        {/* Object Type Display */}
        {objectType && (
          <Typography variant="body1" style={{ marginTop: '20px', fontWeight: 'bold' }}>
            Hey it's {objectType} !!!
          </Typography>
        )}

        {/* Results Pane */}
        {results.length > 0 && (
          <ResultsBox>
            <CSSTransition
              in={fadeIn}
              timeout={300}
              classNames="fade"
              onExited={() => {
                setResults(displayedResults); // Update results to displayedResults
                setFadeIn(false); // Reset fade-in for the next update
              }}
              unmountOnExit
            >
              <Box>
                <Typography variant="h5" gutterBottom>
                  Top Matches for Your Uploaded Image
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Below are the top matches based on your uploaded image. 
                </Typography>
                {displayedResults.map((result) => (
                  <ResultItem key={result.id}>
                    <ResultImage src={result.image} alt={result.title} />
                    <Box>
                      <Typography variant="h6">{result.title}</Typography>
                      <Typography variant="body2">{result.description}</Typography>
                    </Box>
                  </ResultItem>
                ))}
                <Box display="flex" justifyContent="center" marginTop="20px">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  style={{ marginTop: '20px' }}
                />
                </Box>
              </Box>
            </CSSTransition>
          </ResultsBox>
        )}
      </ContentBox>

      {/* Footer */}
      <Footer>
        <Typography variant="body1">© 2024 Miracle Software Systems, Inc. | All rights reserved.</Typography>
      </Footer>
    </MainContainer>
  );
};

export default HomePage;
