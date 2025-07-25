<template>
  <div class="conteudo">
    <!-- Кнопки для прокрутки -->
    <button style="box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);"
      class="buttonsScroll buttonsScroll_left" 
      @click="scrollCarrousel(-1)" 
      :disabled="currentIndex === 0"
      :class="{ 'disabled': currentIndex === 0 }"
      ref="leftButton">
      <img src="../../assets/img/header/Vector (8).svg" alt="" />
    </button>
    <button style="box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);"
      class="buttonsScroll buttonsScroll_right" 
      @click="scrollCarrousel(1)" 
      :disabled="currentIndex === duplicatedTwoBanner.length - 1"
      :class="{ 'disabled': currentIndex === duplicatedTwoBanner.length - 1 }"
      ref="rightButton">
      <img src="../../assets/img/header/Vector (7).svg" alt="" />
    </button>

    <!-- Карусель -->
    <div class="carrousel" ref="carrousel">
      <article
        v-for="(item, index) in duplicatedTwoBanner"
        :key="index"
        :class="{
          active: index === currentIndex,
          inactive: index !== currentIndex
        }"
        class="card"
      >
        <!-- Отображаем изображение из twoBanner -->
        <img :src="item.imageUrl" alt="image" style="cursor: pointer;" class="carrousel-image" @click="goToCategory(item)" />
      </article>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    twoBanner: {
      type: Array,
      default: () => []
    },

    mainSlider: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentIndex: 0, // Начальный индекс
    };
  },
  computed: {
  ...mapGetters({
    GEO: 'GEO/STATE'
  }),
  duplicatedTwoBanner() {
    // Дублируем массив mainSlider 10 раз с увеличением индексов
    return Array.from({ length: 29 }, (_, i) => 
      this.mainSlider.map((item, index) => ({
        ...item,
        index: index + i * this.mainSlider.length // увеличиваем индекс
      }))
    ).flat(); // "расплющиваем" массив
  }
},
mounted() {
  this.$nextTick(() => {
    if (this.mainSlider && this.mainSlider.length > 0) {
      this.currentIndex = 0; // Инициализируем индекс на первый элемент
    } else {
      console.warn("mainSlider is empty");
      this.currentIndex = 0; // Если массив пуст, ставим индекс в 0 (или можно скрывать компонент)
    }

    const carrousel = this.$refs.carrousel;
    const leftButton = this.$refs.leftButton;
    const rightButton = this.$refs.rightButton;

    // Скрываем карусель и кнопки до начала прокрутки
    carrousel.style.visibility = "hidden";
    leftButton.style.visibility = "hidden";
    rightButton.style.visibility = "hidden";

    // Добавляем задержку, чтобы гарантировать, что элементы готовы
    setTimeout(() => {
      if (this.mainSlider.length > 0) {
        setTimeout(() => {
  this.scrollCarrousel(1);  // Первый раз
}, 30);
setTimeout(() => {
  this.scrollCarrousel(1);  // Второй раз
}, 60);
setTimeout(() => {
  this.scrollCarrousel(1);  // Третий раз
}, 90);
setTimeout(() => {
  this.scrollCarrousel(1);  // Четвертый раз
}, 120);
setTimeout(() => {
  this.scrollCarrousel(1);  // Пятый раз
}, 150);
setTimeout(() => {
  this.scrollCarrousel(1);  // Шестой раз
}, 180);
setTimeout(() => {
  this.scrollCarrousel(1);  // Седьмой раз
}, 210);
setTimeout(() => {
  this.scrollCarrousel(1);  // Восьмой раз
}, 240);
setTimeout(() => {
  this.scrollCarrousel(1);  // Девятый раз
}, 270);
setTimeout(() => {
  this.scrollCarrousel(1);  // Десятый раз
}, 300);
setTimeout(() => {
  this.scrollCarrousel(1);  // Одиннадцатый раз
}, 330);
setTimeout(() => {
  this.scrollCarrousel(1);  // Двенадцатый раз
}, 360);
setTimeout(() => {
  this.scrollCarrousel(1);  // Тринадцатый раз
}, 390);
setTimeout(() => {
  this.scrollCarrousel(1);  // Четырнадцатый раз
}, 420);
setTimeout(() => {
  this.scrollCarrousel(1);  // Пятнадцатый раз
}, 450);
setTimeout(() => {
  this.scrollCarrousel(1);  // Шестнадцатый раз
}, 480);
setTimeout(() => {
  this.scrollCarrousel(1);  // Семнадцатый раз
}, 510);
setTimeout(() => {
  this.scrollCarrousel(1);  // Восемнадцатый раз
}, 540);
setTimeout(() => {
  this.scrollCarrousel(1);  // Девятнадцатый раз
}, 570);
setTimeout(() => {
  this.scrollCarrousel(1);  // Двадцатый раз
}, 600);
setTimeout(() => {
  this.scrollCarrousel(1);  // Двадцать первый раз
}, 630);
setTimeout(() => {
  this.scrollCarrousel(1);  // Двадцать второй раз
}, 660);
setTimeout(() => {
  this.scrollCarrousel(1);  // Двадцать третий раз
}, 690);
setTimeout(() => {
  this.scrollCarrousel(1);  // Двадцать четвертый раз
}, 720);
setTimeout(() => {
  this.scrollCarrousel(1);  // Двадцать пятый раз
}, 750);
setTimeout(() => {
  this.scrollCarrousel(1);  // Двадцать шестой раз
}, 780);
setTimeout(() => {
  this.scrollCarrousel(1);  // Двадцать седьмой раз
}, 810);
setTimeout(() => {
  this.scrollCarrousel(1);  // Двадцать восьмой раз
}, 840);
setTimeout(() => {
  this.scrollCarrousel(1);  // Двадцать девятый раз
}, 870);
setTimeout(() => {
  this.scrollCarrousel(1);  // Тридцатый раз
}, 900);
setTimeout(() => {
  this.scrollCarrousel(1);  // Тридцатый раз
}, 930);
setTimeout(() => {
  this.scrollCarrousel(1);  // Тридцатый раз
}, 960);
setTimeout(() => {
  this.scrollCarrousel(1);  // Тридцатый раз
}, 990);
setTimeout(() => {
  this.scrollCarrousel(1);  // Тридцатый раз
}, 1020);
setTimeout(() => {
  this.scrollCarrousel(1);  // Тридцатый раз
}, 1050);
setTimeout(() => {
  this.scrollCarrousel(1);  // Тридцатый раз
}, 1080);

      }
       // После прокрутки делаем элементы видимыми
       setTimeout(() => {
        carrousel.style.transition = "opacity 0.3s ease";
        carrousel.style.visibility = "visible"; // Делаем карусель видимой
        carrousel.style.opacity = 1;

        leftButton.style.transition = "opacity 0.3s ease";
        rightButton.style.transition = "opacity 0.3s ease";
        leftButton.style.visibility = "visible"; // Делаем кнопки видимыми
        rightButton.style.visibility = "visible"; // Делаем кнопки видимыми
        leftButton.style.opacity = 1;
        rightButton.style.opacity = 1;
      }, 3300); // После того как прокрутка завершится (1200мс)
    }, 3300);  // Задержка для инициализации
  });
},

updated() {
  // Обновляем индекс после перерисовки компонента
  if (this.mainSlider && this.mainSlider.length > 0) {
    this.scrollToActiveItem();  // Прокрутить к активному элементу, если обновление страницы произошло
  }
},

methods: {
  scrollToActiveItem() {
    const carrousel = this.$refs.carrousel;
    const activeItem = carrousel.querySelector('.card.active');
    
    if (activeItem) {
      carrousel.scrollTo({
        left: activeItem.offsetLeft,
        behavior: 'smooth'
      });
    }
  },

  scrollCarrousel(direction) {
    const carrousel = this.$refs.carrousel;

    if (this.mainSlider.length === 0) {
      return;
    }
  // Фиксированное значение прокрутки
  const scrollAmount = 908;
    // Получаем ширину карточки, с учетом отступов
   


   

    // Проверяем, можно ли прокручивать в указанном направлении
    if ((direction === -1 && this.currentIndex === 0) || 
        (direction === 1 && this.currentIndex === this.duplicatedTwoBanner.length - 1)) {
      return;
    }

    // Прокручиваем карусель
    carrousel.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth"
    });

    // Обновляем индекс до прокрутки
    let newIndex = this.currentIndex + direction;

    // Если индекс выходит за пределы, нужно "замкнуть" его
    if (newIndex < 0) {
      newIndex = this.duplicatedTwoBanner.length - 1;
    } else if (newIndex >= this.duplicatedTwoBanner.length) {
      newIndex = 0;
    }

    // Обновляем текущий индекс
    this.currentIndex = newIndex;
  }
}
  
};
</script>



<style scoped>
/* Скрытие полосы прокрутки */
.carrousel::-webkit-scrollbar {
  display: none;
}

/* Стиль карточки */
.card {
  scroll-snap-align: center;
  border-radius: 30px;
  height: 400px;
  width: 1016px; /* Используем ширину экрана для адаптивности */
  max-width: 1016px; /* Максимальная ширина для предотвращения слишком большого масштаба */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Активная карточка */
.card.active {
  animation: flash 0.3s ease-out forwards;
  transform: scale(1.0) !important;
  transform-origin: center center;
  width: 1016px;
  max-width: 1016px;
  height: 462px;
  opacity: 1;
  margin-top: 20px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
}

/* Неактивная карточка */
.card.inactive {
  margin-top: 50px;
  transform: none;
  width: 908px;
  max-width: 908px;
  height: 401px;
  opacity: 1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Анимация для активной карточки */
@keyframes flash {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
}

/* Изображение в карусели */
.carrousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Изображение активной карточки */
.card.active .carrousel-image {
  transform: scale(1.0);
}

/* Кнопки прокрутки */
.buttonsScroll {
  height: 64px;
  width: 64px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(225, 225, 225, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 20px;
  border-radius: 69px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background-color 0.3s ease;
}

/* Ховер для кнопок */
.buttonsScroll:hover {
  background-color: rgba(80, 60, 195, 1);
}

/* Позиция кнопки слева */
.buttonsScroll_left {
  z-index: 3;
  left: 10%;
}

/* Позиция кнопки справа */
.buttonsScroll_right {
  z-index: 3;
  right: 10%;
}

/* Изображение на кнопках */
.buttonsScroll img {
  height: 20px;
  width: 12px;
  object-fit: contain;
}

/* Стили для неактивных кнопок */
.buttonsScroll.disabled {
  background-color: rgba(160, 160, 160, 0.7);
  cursor: not-allowed;
}

/* Мобильные стили */
@media (max-width: 1024px) {
  .card {
    width: 80%; /* Сделать карточки меньше на средних экранах */
    height: 300px;
  }
}

/* Стиль для экранов до 768px (мобильные устройства) */
@media (max-width: 768px) {
  .carrousel-image {
    width: 100% !important;
        height: 100% !important;
      
  }
  .card.active, .card.inactive {
    opacity: 1 !important;  /* Снимаем эффекты активности для мобильных */
    transform: none !important;  /* Отключаем трансформации */
    margin-top: 0 !important; /* Убираем отступы */
  }
  .card {
    opacity: 0;
    width: 330px !important; /* Задаем фиксированную ширину для мобильных устройств */
    height: 150px !important; /* Корректируем высоту */
    margin: 0 auto; /* Выравниваем по центру */
  }

  .buttonsScroll_left, .buttonsScroll_right {
    opacity: 0 !important;
   
  }
}

/* Стиль для экранов больше 1024px */
@media (min-width: 1025px) {
  .card {
    width: 70%; /* Уменьшаем размер карточек на экранах больше 1024px */
    height: 350px;
  }
}

/* Стиль для экранов 2K и выше (например, для разрешения 2560x1440) */
@media (min-width: 1440px) {
  .card {
    width: 60%; /* Сделать карточки чуть больше для экранов 2K */
    height: 400px;
  }
}

/* Стиль для 4K экранов */
@media (min-width: 2560px) {
  .card {
    width: 50%; /* Увеличиваем размер карточек для экранов 4K */
    height: 450px;
  }
}

</style>